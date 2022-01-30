import { UsersModule } from './../users/users.module';
import { ChannelsModule } from './../channels/channels.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { Invite, InviteSchema } from './schemas/invite.schema';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService],
  imports: [
    MongooseModule.forFeature([{ name: Invite.name, schema: InviteSchema }]),
    ChannelsModule,
    UsersModule
  ],
})
export class InvitesModule {}
