import {IsString, IsEmail, IsArray, IsUrl, IsUUID} from 'class-validator';

export class UserFrontendDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  username: string;

  @IsString()
  tag: string;

  @IsEmail()
  email: string;

  @IsArray()
  channels: string[];

  @IsUrl()
  avatarUrl: string;

  constructor(data: any) {
    this.uuid = data._id || data.uuid;
    this.username = data.username;
    this.tag = data.tag;
    this.email = data.email;
    this.channels = data.channels;
    this.avatarUrl = data.avatarUrl;
  }
}