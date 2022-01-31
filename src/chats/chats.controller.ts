import { UpdateChatDTO } from './dto/update-chat.dto';
import { ChatsService } from './chats.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('api/chats')
export class ChatsController {
  constructor(private readonly ChatsService: ChatsService) {}

  // GET

  @UseGuards(JwtAuthGuard)
  @Get('/find_for_channel')
  findChatsForChannel(@Query('cid') cid: string) {
    return this.ChatsService.findChatsForChannel(cid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cid')
  findChat(@Param('cid') cid: string) {
    return this.ChatsService.findChat(cid);
  }

  // POST

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createChat(@Body() createChatDTO: CreateChatDTO) {
    return this.ChatsService.createChat(createChatDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/preload_all_chats')
  @HttpCode(200)
  preloadAllChats(@Body() body: { cid: string[] }) {
    return this.ChatsService.preloadAllChats(body.cid);
  }

  // PATCH

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  updateChat(@Body() updateChatDTO: UpdateChatDTO) {
    return this.ChatsService.updateChat(updateChatDTO);
  }

  // DELETE

  @UseGuards(JwtAuthGuard)
  @Delete(':cid')
  deleteChat(@Param('cid') cid: string) {
    return this.ChatsService.deleteChat(cid);
  }
}
