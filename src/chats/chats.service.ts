import { DeleteMemberDTO } from './dto/delete-member.dto';
import { AddMemberDTO } from './dto/add-member.dto';
import { ChatUpdatedFrontendDTO } from './dto/frontend/chat-updated.dto';
import { UpdatableFieldsChatDTO } from './dto/updatable-fields-chat.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { ChannelFrontendDTO } from './../channels/dto/frontend/channel-frontend.dto';
import { ChatFrontendDTO } from './dto/frontend/chat-frontend.dto';
import { ChannelsService } from './../channels/channels.service';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDTO } from './dto/create-chat.dto';
import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService,
  ) {}

  async createChat(
    createChatDTO: CreateChatDTO,
    limited: boolean = true,
    offCheck: boolean = false,
  ) {
    const { title, owningChannelId } = createChatDTO;

    let chat;

    if (offCheck && createChatDTO.members) {
      chat = await this.chatModel.create({
        members: createChatDTO.members,
        title,
        owningChannelId,
      });
    } else {
      const channel = await this.channelsService.findChannel(owningChannelId);
      chat = await this.chatModel.create({
        members: channel.members,
        title,
        owningChannelId,
      });
      await this.channelsService.addChat(chat._id, owningChannelId);
    }

    //@ts-ignore
    if (limited) return new ChatFrontendDTO(chat._doc);
    return chat;
  }

  async deleteChat(cid: string, limited: boolean = true) {
    const chat = await this.chatModel.findByIdAndDelete(cid);
    if (!chat) throw new BadRequestException(`No chat with ${cid}`);

    const channel = await this.channelsService.pullChat(
      cid,
      chat.owningChannelId,
    );

    return {
      chat: new ChatFrontendDTO(chat),
      channel: new ChannelFrontendDTO(channel),
    };
  }

  async findChat(cid: string, limited: boolean = true) {
    const chat = await this.chatModel.findById(cid);
    if (!chat) throw new BadRequestException(`No chat with ${cid}`);

    if (limited) return new ChatFrontendDTO(chat);

    return chat;
  }

  async findChatsForChannel(cid: string, limited: boolean = true) {
    const channel = await this.channelsService.findChannel(cid, false);
    if (!channel) throw new BadRequestException(`No channel with ${cid}`);

    //@ts-ignore
    const chats = await this.chatModel.find({ owningChannelId: channel._id });

    if (limited) {
      return chats.map((chat) => new ChatFrontendDTO(chat));
    }

    return chats;
  }

  async addMessage(cid: string, mid: string) {
    await this.chatModel.findByIdAndUpdate(cid, {
      $inc: { 'stats.messageCount': 1 },
    });
  }

  async deleteMessage(cid: string, mid: string) {
    await this.chatModel.findByIdAndUpdate(cid, {
      $inc: { 'stats.messageCount': -1 },
    });
  }

  async preloadAllChats(cid: string[]) {
    const chats = await this.chatModel.find({ owningChannelId: { $in: cid } });
    const limited: Record<string, ChatFrontendDTO> = {};
    chats
      .map((chat) => new ChatFrontendDTO(chat))
      .forEach((chat) => (limited[chat.uuid] = chat));

    return limited;
  }

  async updateChat(updateChatDTO: UpdateChatDTO) {
    let { cid, chat } = updateChatDTO;
    chat = new UpdatableFieldsChatDTO(chat);

    const updatedChat = await this.chatModel.findByIdAndUpdate(cid, chat, {
      new: true,
    });

    if (!updatedChat) throw new BadRequestException(`Chat ${cid} not found`);

    return new ChatUpdatedFrontendDTO(updatedChat);
  }

  async addMember(addMemberDTO: AddMemberDTO) {
    let { cid, uid } = addMemberDTO;

    // TODO пока что во все каналы добавляет, переделать, когда будут приватные комнаты

    await this.chatModel.updateMany(
      { _id: { $in: cid } },
      { $addToSet: { members: { $each: uid } } },
    );
  }

  async deleteMember(deleteMemberDTO: DeleteMemberDTO) {
    let { cid, uid } = deleteMemberDTO;

    // TODO пока что удаляет из всех комнат

    await this.chatModel.updateMany(
      { _id: { $in: cid } },
      { $pullAll: { members: uid } },
    );
  }
}
