import { EditMessageDTO } from './dto/edit-message.dto';
import { DeleteMessageDTO } from './dto/delete-message.dto';
import { MessageDocument } from './schemas/message.schema';
import { MessageFrontendDTO } from './dto/frontend/message-frontend.dto';
import { MessagesService } from './messages.service';
import { SendMessageDTO } from './dto/send-message.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly MessagesService: MessagesService) {}

  // GET

  @UseGuards(JwtAuthGuard)
  @Get('/get_history')
  getHistory(@Query() query: { cid: string; shift: number }) {
    return this.MessagesService.getHistory(query.cid, query.shift);
  }

  // POST

  @UseGuards(JwtAuthGuard)
  @Post('/send')
  sendMessage(
    @Body() sendMessageDTO: SendMessageDTO,
    @Request() req,
  ): Promise<MessageFrontendDTO | MessageDocument> {
    return this.MessagesService.sendMessage(req.user.uid, sendMessageDTO);
  }

  // PUT

  @UseGuards(JwtAuthGuard)
  @Put('/edit')
  editMessage(@Body() editMessageDTO: EditMessageDTO, @Request() req) {
    return this.MessagesService.editMessage(editMessageDTO, req.user.uid);
  }

  // DELETE

  @UseGuards(JwtAuthGuard)
  @Delete('/delete')
  deleteMessage(@Query() query: DeleteMessageDTO, @Request() req) {
    return this.MessagesService.deleteMessage(query, req.user.uid);
  }
}
