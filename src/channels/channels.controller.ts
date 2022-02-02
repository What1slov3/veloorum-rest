import { UpdateChannelDTO } from './dto/update-channel.dto';
import { getUploadedFileUrl } from './../common/getUploadedFileUrl';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChannelsService } from './channels.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { multerOptions } from 'src/common/configs/storage.config';

@Controller('api/channels')
export class ChannelsController {
  constructor(private readonly ChannelsService: ChannelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'title' }, { name: 'icon', maxCount: 1 }],
      multerOptions,
    ),
  )
  createChannel(@Body() body, @UploadedFiles() files, @Request() req) {
    return this.ChannelsService.createChannel({
      uid: req.user.uid,
      iconUrl: getUploadedFileUrl(files.icon[0]),
      title: body.title,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cid')
  getChannel(@Param('cid') cid: string) {
    return this.ChannelsService.findChannel(cid, true);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update_channel')
  updateChannel(@Body() body: UpdateChannelDTO) {
    this.ChannelsService.updateChannel(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update_channel_icon')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'cid' }, { name: 'icon', maxCount: 1 }],
      multerOptions,
    ),
  )
  updateChannelIcon(@Body() body, @UploadedFiles() files) {
    return this.ChannelsService.updateChannelIcon(
      body.cid,
      getUploadedFileUrl(files.icon[0]),
    );
  }
}
