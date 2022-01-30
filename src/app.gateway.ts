import { SystemMessageDTO } from 'src/messages/dto/system-message.dto';
import { OnEvent } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ transports: 'websocket' })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  //! Пока все в одном файле, по мере увеличения логики разделить и оптимизировать

  @SubscribeMessage('registerUser')
  handleRegisterUser(
    client: Socket,
    payload: { chats: string[]; channels: string[] },
  ) {
    client.join(payload.chats);
    client.join(payload.channels);
    client.emit('userRegistered', { success: true });
  }

  @SubscribeMessage('sendUserMessage')
  handleSendMessage(client: Socket, payload: any) {
    client
      .to(payload.context.chatId)
      .emit('receive/chats/userMessage', payload);
  }

  @SubscribeMessage('deleteUserMessage')
  handleDeleteMessage(client: Socket, payload: any) {
    client
      .to(payload.context.chatId)
      .emit('receive/chats/deleteUserMessage', payload);
  }

  @SubscribeMessage('editUserMessage')
  handleEditMessage(client: Socket, payload: any) {
    client
      .to(payload.context.chatId)
      .emit('receive/chats/editUserMessage', payload);
  }

  @SubscribeMessage('addTypingUser')
  handleAddTypingUser(client: Socket, payload: any) {
    client.to(payload.cid).emit('receive/appdata/addTypingUser', payload);
  }

  @SubscribeMessage('pullTypingUser')
  handlePullTypingUser(client: Socket, payload: any) {
    client.to(payload.cid).emit('receive/appdata/pullTypingUser', payload);
  }

  @SubscribeMessage('updateUserData')
  handleUpdateUserData(client: Socket, payload: any) {
    client.to(payload.channels).emit('receive/users/updateUserData', payload);
  }

  @SubscribeMessage('updateChannel')
  handleUpdateChannel(client: Socket, payload: any) {
    client.to(payload.uuid).emit('receive/channels/updateChannel', payload);
  }

  @SubscribeMessage('createChat')
  handleCreateChat(client: Socket, payload: any) {
    client
      .to(payload.owningChannelId)
      .emit('receive/chats/pushNewChat', payload);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(client: Socket, payload: any) {
    client.join(payload.cid);
  }

  @OnEvent('push/new_user')
  handleJoinUser(payload: SystemMessageDTO) {
    this.server
      .to(payload.context.chatId)
      .emit('receive/chats/userMessage', payload);
    this.server.to(payload.context.channelId).emit('receive/common/newUser', {
      uid: payload.content.targetUser,
      cid: payload.context.channelId,
    });
  }
}
