import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { AppGateway } from './app.gateway';
import { InvitesModule } from './invites/invites.module';
import { PushModule } from './push/push.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI, { appName: 'Astro' }),
    MulterModule.register({
      dest: './',
    }),
    EventEmitterModule.forRoot({
      delimiter: '/',
    }),
    ChannelsModule,
    FilesModule,
    AuthModule,
    UsersModule,
    MessagesModule,
    ChatsModule,
    InvitesModule,
    PushModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
