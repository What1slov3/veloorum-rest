import { SystemMessageDTO } from './dto/system-message.dto';
import { EditMessageDTO } from './dto/edit-message.dto';
import { DeleteMessageDTO } from './dto/delete-message.dto';
import { MessageFrontendDTO } from './dto/frontend/message-frontend.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { SendMessageDTO } from './dto/send-message.dto';
import { ChatsService } from './../chats/chats.service';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly ChatsService: ChatsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(
    uid: string,
    sendMessageDTO: SendMessageDTO,
    limited: boolean = true,
  ) {
    const { content, context } = sendMessageDTO;

    if (!content.text && !content.attachments.length) {
      throw new BadRequestException();
    }

    const message = await this.messageModel.create({
      ownerId: uid,
      content,
      context,
    });

    if (!message) {
      throw new InternalServerErrorException();
    }

    await this.ChatsService.addMessage(context.chatId, message._id);

    const messageFrontendDTO = new MessageFrontendDTO(message);

    //? PATH: app.gateway.ts/
    this.eventEmitter.emit('messages/user/send', messageFrontendDTO);
    if (limited) return messageFrontendDTO;

    return message;
  }

  async getHistory(cid: string, shift: number, limited: boolean = true) {
    if (shift < 0) throw new BadRequestException('Shift must be > 0');

    const chat = await this.ChatsService.findChat(cid, false);
    const messages = await this.messageModel
      .find({ 'context.chatId': cid })
      .sort({ createdAt: -1 })
      .skip(+shift)
      .limit(30);

    if (limited) {
      return {
        history: messages
          .map((message) => new MessageFrontendDTO(message))
          .reverse(),
        chatId: cid,
        //@ts-ignore
        hasMore: chat.stats.messageCount > +shift + 30,
      };
    }

    return messages;
  }

  async deleteMessage(
    deleteMessageDTO: DeleteMessageDTO,
    uid: string,
    limited: boolean = true,
  ) {
    const message = await this.messageModel.findOneAndDelete({
      'context.chatId': deleteMessageDTO.cid,
      _id: deleteMessageDTO.mid,
      ownerId: uid,
    });

    if (!message)
      throw new BadRequestException(
        `No message ${deleteMessageDTO.mid} or wrong UID`,
      );

    await this.ChatsService.deleteMessage(
      deleteMessageDTO.cid,
      deleteMessageDTO.mid,
    );

    if (limited) {
      return new MessageFrontendDTO(message);
    }

    return message;
  }

  async editMessage(
    editMessageDTO: EditMessageDTO,
    uid: string,
    limited: boolean = true,
  ) {
    const message = await this.messageModel.findOneAndUpdate(
      {
        'context.chatId': editMessageDTO.cid,
        _id: editMessageDTO.mid,
        ownerId: uid,
      },
      {
        content: editMessageDTO.content,
      },
      {
        new: true,
      },
    );

    if (!message)
      throw new BadRequestException(
        `No message ${editMessageDTO.mid} or wrong UID`,
      );

    if (limited) {
      return new MessageFrontendDTO(message);
    }

    return message;
  }

  @OnEvent('systemMessage/new_user')
  async sendSystemMessage(systemMessage: SystemMessageDTO) {
    const { content, context, systemType } = systemMessage;
    const message = await this.messageModel.create({
      type: 'system',
      systemType,
      content,
      context,
    });

    if (!message) {
      throw new InternalServerErrorException();
    }

    await this.ChatsService.addMessage(context.chatId, message._id);

    this.eventEmitter.emit(
      `push/${systemType}`,
      new MessageFrontendDTO(message),
    );

    return message;
  }
}
