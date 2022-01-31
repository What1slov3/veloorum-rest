import { UsersService } from './../users/users.service';
import * as jwt from 'jsonwebtoken';
import { isDev } from './../common/isDev';
import { GetChannelInfoDTO } from './dto/frontend/get-channel-info.dto';
import { ChannelsService } from './../channels/channels.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument, InviteSchema } from './schemas/invite.schema';
import generateRandomString from 'src/common/generateRandomString';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
  ) {}

  public async createInvite(cid: string, uid: string) {
    const channel = await this.channelsService.findChannel(cid);
    if (channel.ownerId !== uid) throw new BadRequestException();

    await this.inviteModel.findOneAndDelete({ cid });
    const invite = await this.inviteModel.create({
      url: `${
        isDev() ? process.env.STATIC_URL : process.env.URL
      }/invite/${generateRandomString(10)}`,
      cid,
    });

    return {
      cid: invite.cid,
      url: invite.url,
    };
  }

  public async getInvite(cid: string, uid: string) {
    const invite = await this.inviteModel.findOne({ cid });
    if (!invite) return this.createInvite(cid, uid);

    return {
      cid: invite.cid,
      url: invite.url,
    };
  }

  public async getChannelInfoForInvite(url: string, token: string = '') {
    const invite = await this.inviteModel.findOne({ url });
    if (!invite) {
      throw new BadRequestException(`No channel for invite: ${url}`);
    }

    const channel = await this.channelsService.findChannel(
      `${invite.cid}`,
      false,
    );
    if (!channel) {
      throw new BadRequestException(`No channel for invite: ${url}`);
    }

    let alreadyJoin;
    if (token) {
      const uid = jwt.decode(token.split(' ')[1]).sub;

      if (typeof uid === 'string') {
        alreadyJoin =
          (await this.usersService.findUserById(uid)).channels.includes(
            `${invite.cid}`,
          ) && channel.members.includes(uid);
      }
    }

    return {
      ...new GetChannelInfoDTO({
        //@ts-ignore
        ...channel._doc,
        membersCount: channel.members.length,
      }),
      alreadyJoin,
    };
  }
}
