import { ChatsModule } from './../chats/chats.module';
import { UsersModule } from './../users/users.module';
import { Channel, ChannelSchema } from './schemas/channel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  providers: [ChannelsService],
  controllers: [ChannelsController],
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => ChatsModule),
  ],
  exports: [ChannelsService],
})
export class ChannelsModule {}
