import { getUploadedFileUrl } from './../common/getUploadedFileUrl';
import { multerOptions } from 'src/common/configs/storage.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { JoinLeaveChannelDTO } from './dto/join-leave-channel.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import GetLoadedUsersDTO from './dto/get-loaded-users.dto';
import ChangeUserDataDTO from './dto/change-user-data.dto';
import ChangePasswordDTO from './dto/change-password.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  createUser(@Body() createUserDTO: CreateUserDTO) {
    this.usersService.createUser(createUserDTO);
    return { message: 'Created' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/join_channel')
  joinChannel(@Body() body: JoinLeaveChannelDTO, @Req() req) {
    return this.usersService.joinChannel(body.cid, req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/leave_channel')
  leaveChannel(@Body() body: JoinLeaveChannelDTO, @Req() req) {
    return this.usersService.leaveChannel(body.cid, req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/upload_avatar')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  uploadAvatar(@UploadedFile() file, @Request() req) {
    return this.usersService.setAvatar(req.user.uid, getUploadedFileUrl(file));
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get_loaded_users')
  @HttpCode(200)
  getLoadedUsers(@Body() getLoadedUsersDTO: GetLoadedUsersDTO) {
    return this.usersService.findLoadedUsersById(getLoadedUsersDTO.usersId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change_user_data')
  changeUserData(@Body() body: ChangeUserDataDTO, @Req() req) {
    return this.usersService.changeUserData(body, req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change_password')
  changePassword(@Body() body: ChangePasswordDTO, @Req() req) {
    return this.usersService.changePassword(body, req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/init')
  init(@Request() req) {
    return this.usersService.init(req.user.uid);
  }

  //! ПОСЛЕДНЕЕ
  @UseGuards(JwtAuthGuard)
  @Get(':uid')
  findUser(@Param('uid') uid) {
    return this.usersService.findUserById(uid);
  }
}
