import { UsersModule } from './../users/users.module';
import { ChannelsModule } from './../channels/channels.module';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
  providers: [ChatsService],
  controllers: [ChatsController],
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => ChannelsModule),
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
