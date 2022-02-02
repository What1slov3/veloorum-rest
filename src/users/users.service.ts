import { getRandomGreetings } from './../common/getRandomGreeetings';
import { getRandomBye } from './../common/getRandomBye';
import { AddMemberDTO } from './../chats/dto/add-member.dto';
import { ChatsService } from './../chats/chats.service';
import { LoadedUserDTO } from './dto/frontend/loadedUser.frontend.dto';
import { ChannelFrontendDTO } from './../channels/dto/frontend/channel-frontend.dto';
import { ChannelsService } from './../channels/channels.service';
import { ICreateUser } from './interfaces/create-user.interface';
import { User, UserDocument } from './schemas/user.schema';
import {
  Injectable,
  InternalServerErrorException,
  forwardRef,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { UserFrontendDTO } from './dto/frontend/user.frontend.dto';
import { SystemMessageDTO } from 'src/messages/dto/system-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import ChangeUserDataDTO from './dto/change-user-data.dto';
import ChangePasswordDTO from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async findOneUserHandle(query: any): Promise<User> {
    const user = await this.userModel.findOne(query);
    if (!user) throw new BadRequestException('User not found');
    //@ts-ignore
    return user._doc;
  }

  async createUser(user: ICreateUser): Promise<void> {
    const candidate = await this.userModel.findOne({ email: user.email });

    if (candidate) {
      throw new BadRequestException(`User ${user.email} is already exists`);
    }

    await this.userModel.create({
      username: user.username,
      email: user.email,
      _passwordHash: await argon2.hash(user.password),
    });

    return;
  }

  async findUserById(uid: string, limited: boolean = true) {
    const user = await this.findOneUserHandle({ _id: uid });

    if (limited) return new UserFrontendDTO(user);
    return user;
  }

  async findUserByField() {}

  async findUserForAuth(query: Record<string, string | number>): Promise<User> {
    const user = await this.findOneUserHandle(query);
    //@ts-ignore
    return user;
  }

  async findLoadedUsersById(query: string[]) {
    const users = await this.userModel.find({ _id: { $in: query } });
    const response: Record<string, LoadedUserDTO> = {};

    users.forEach((user) => {
      response[user._id] = new LoadedUserDTO(user);
    });

    return response;
  }

  async setAvatar(uid: string, url: string) {
    const user = await this.userModel.findByIdAndUpdate(
      uid,
      {
        avatarUrl: url,
      },
      { new: true },
    );

    return user;
  }

  async addChannelToUser(uid: string, cid: string): Promise<User> {
    const candidate = await this.userModel.findById(uid);

    if (!candidate) {
      throw new BadRequestException(`User ${uid} is not found`);
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: uid },
      { $push: { channels: cid } },
      { new: true },
    );

    if (!user) {
      throw new InternalServerErrorException(
        'Something broke, try again later',
      );
    }

    return user;
  }

  async joinChannel(cid: string, uid: string) {
    const candidate = await this.userModel.findById(uid);

    if (!candidate) {
      throw new BadRequestException(`User ${uid} is not found`);
    }

    const members = (await this.channelsService.findChannel(cid)).members;

    if (candidate.channels.includes(cid) && members.includes(uid)) {
      throw new BadRequestException(
        `User ${uid} already is a member of ${cid}`,
      );
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: uid },
      { $push: { channels: cid } },
      { new: true },
    );

    const channel = await this.channelsService.addMember(cid, uid);

    await this.chatsService.addMember(
      new AddMemberDTO({ cid: channel.chats, uid: [uid] }),
    );

    // PATH: app.gateway.ts/userJoin, messages.service.ts/sendSystemMessage
    this.eventEmitter.emit(
      'systemMessage/send',
      new SystemMessageDTO({
        context: { chatId: channel.systemChat, channelId: channel._id },
        content: {
          text: getRandomGreetings(),
          targetUser: uid,
        },
        systemType: 'userJoin',
        system: true,
      }),
    );

    return {
      user: new UserFrontendDTO(user),
      channel: new ChannelFrontendDTO(channel),
    };
  }

  async leaveChannel(cid: string, uid: string) {
    const candidate = await this.userModel.findById(uid);

    if (!candidate) {
      throw new BadRequestException(`User ${uid} is not found`);
    }

    if (!candidate.channels.includes(cid)) {
      throw new BadRequestException(`User ${uid} is not a member of ${cid}`);
    }

    const user = await this.userModel.findOneAndUpdate(
      { _id: uid },
      { $pull: { channels: cid } },
      { new: true },
    );

    const channel = await this.channelsService.pullMember(cid, uid);

    // PATH: messages.service.ts/sendSystemMessage
    this.eventEmitter.emit(
      'systemMessage/send',
      new SystemMessageDTO({
        context: { chatId: channel.systemChat, channelId: channel._id },
        content: {
          text: getRandomBye(),
          targetUser: uid,
        },
        systemType: 'userLeft',
        system: true,
      }),
    );

    return {
      user: new UserFrontendDTO(user),
      cid,
    };
  }

  async changeUserData(changeUserDataDTO: ChangeUserDataDTO, uid: string) {
    const { email, username, password } = changeUserDataDTO;

    const candidate = await this.userModel.findById(uid);

    if (!candidate) {
      throw new BadRequestException(`User ${uid} is not found`);
    }

    const passwordsEqual = await argon2.verify(
      candidate._passwordHash as string,
      password,
    );

    if (!passwordsEqual) throw new UnauthorizedException();

    const user = await this.userModel.findByIdAndUpdate(
      uid,
      { email, username },
      {
        new: true,
      },
    );

    return new UserFrontendDTO(user);
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO, uid: string) {
    const { newPassword, currentPassword } = changePasswordDTO;

    const candidate = await this.userModel.findById(uid);

    if (!candidate) {
      throw new BadRequestException(`User ${uid} is not found`);
    }

    const passwordsEqual = await argon2.verify(
      candidate._passwordHash as string,
      currentPassword,
    );

    if (!passwordsEqual) throw new UnauthorizedException();

    const user = await this.userModel.findByIdAndUpdate(
      uid,
      { _passwordHash: await argon2.hash(newPassword) },
      {
        new: true,
      },
    );

    return new UserFrontendDTO(user);
  }

  async init(uid: string) {
    const user = await this.findUserById(uid);
    let channels = await this.channelsService.findChannels(user.channels);

    channels = (channels as ChannelFrontendDTO[]).filter((channel) =>
      channel.members.includes(uid),
    );

    const cid = channels.map((channel) => channel.uuid);
    const preloadedChats = await this.chatsService.preloadAllChats(cid);

    return {
      user: user,
      channels: channels,
      chats: preloadedChats,
    };
  }
}
