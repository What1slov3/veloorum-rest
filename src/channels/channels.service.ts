import { UpdateChannelDTO } from './dto/update-channel.dto';
import { ChatFrontendDTO } from './../chats/dto/frontend/chat-frontend.dto';
import { randomUUID } from 'crypto';
import { ChatsService } from './../chats/chats.service';
import { UserFrontendDTO } from '../users/dto/frontend/user.frontend.dto';
import { ChannelFrontendDTO } from './dto/frontend/channel-frontend.dto';
import { UsersService } from './../users/users.service';
import { ICreateChannel } from './interface/create-channel.interface';
import { Channel, ChannelDocument } from './schemas/channel.schema';
import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteMemberDTO } from 'src/chats/dto/delete-member.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly UsersService: UsersService,
    @Inject(forwardRef(() => ChatsService))
    private readonly ChatsService: ChatsService,
  ) {}

  async createChannel(channelData: ICreateChannel) {
    const preparedCid = randomUUID();

    const greetingsChat = await this.ChatsService.createChat(
      {
        title: 'общее',
        owningChannelId: preparedCid,
        members: [channelData.uid],
      },
      false,
      true,
    );

    const channel = await this.channelModel.create({
      _id: preparedCid,
      type: 'channel',
      members: [channelData.uid],
      allTimeMembers: [channelData.uid],
      iconUrl: channelData.iconUrl,
      ownerId: channelData.uid,
      title: channelData.title,
      chats: [greetingsChat._id],
    });

    const user = await this.UsersService.addChannelToUser(
      channelData.uid,
      channel._id,
    );

    return {
      //@ts-ignore
      channel: new ChannelFrontendDTO(channel._doc),
      user: new UserFrontendDTO(user),
      chat: new ChatFrontendDTO(greetingsChat),
    };
  }

  async findChannel(cid: string, limited: boolean = true) {
    const channel = await this.channelModel.findById(cid);
    if (!channel) throw new BadRequestException(`No channel with ID ${cid}`);

    if (limited) return new ChannelFrontendDTO(channel);
    return channel;
  }

  async findChannels(cid: string[] | [String], limited: boolean = true) {
    const channels = await this.channelModel.find({ _id: cid });
    if (!channels) throw new BadRequestException(`No channel with ID ${cid}`);

    if (limited) {
      return channels.map((channel) => new ChannelFrontendDTO(channel));
    }

    return channels;
  }

  async addMember(cid: string, uid: string) {
    const channel = await this.channelModel.findByIdAndUpdate(
      cid,
      {
        $addToSet: { members: uid, allTimeMembers: uid },
      },
      { new: true },
    );

    return channel;
  }

  async pullMember(cid: string, uid: string) {
    const channel = await this.channelModel.findByIdAndUpdate(
      cid,
      {
        $pull: { members: uid },
      },
      { new: true },
    );

    // TODO если удаляем из канала, то и из чатов соответственно
    this.ChatsService.deleteMember(new DeleteMemberDTO({ cid, uid: [uid] }));

    return channel;
  }

  async addChat(id: string, cid: string) {
    const channel = await this.channelModel.findByIdAndUpdate(
      cid,
      {
        $addToSet: { chats: id },
      },
      { new: true },
    );
    if (!channel) {
      throw new BadRequestException(`No channel with ID ${cid}`);
    }

    return channel;
  }

  async pullChat(id: string, cid: string | String) {
    const channel = await this.channelModel.findByIdAndUpdate(
      cid,
      {
        $pull: { chats: id },
      },
      { new: true },
    );
    if (!channel) {
      throw new BadRequestException(`No channel with ID ${cid}`);
    }

    return channel;
  }

  async updateChat(channelUpdate: UpdateChannelDTO) {
    const { cid, ...data } = channelUpdate;

    const channel = await this.channelModel.findByIdAndUpdate(cid, data, {
      new: true,
    });

    if (!channel) {
      throw new BadRequestException(`No channel with ID ${cid}`);
    }

    return new ChannelFrontendDTO(channel);
  }

  async updateChatIcon(cid: string, iconUrl: string) {
    const channel = await this.channelModel.findByIdAndUpdate(
      cid,
      { iconUrl },
      {
        new: true,
      },
    );

    if (!channel) {
      throw new BadRequestException(`No channel with ID ${cid}`);
    }

    return new ChannelFrontendDTO(channel);
  }
}
