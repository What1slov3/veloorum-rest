import { isDev } from './../common/isDev';
import { InvitesService } from './invites.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createInvite(@Body() body: { cid: string }, @Request() req) {
    return this.invitesService.createInvite(body.cid, req.user.uid);
  }

  @Get('/channel/:id')
  getChannelInfoForInvite(@Request() req) {
    const url = `${isDev() ? process.env.STATIC_URL : process.env.URL}/invite/${
      req.path.match(/([^\/]+$)/)[0]
    }`;
    return this.invitesService.getChannelInfoForInvite(
      url,
      req.headers.authorization,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get/:cid')
  getInvite(@Param('cid') cid: string, @Request() req) {
    return this.invitesService.getInvite(cid, req.user.uid);
  }
}
