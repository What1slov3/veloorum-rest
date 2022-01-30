import {IsString, IsEmail, IsArray, IsUrl, IsUUID} from 'class-validator';

export class LoadedUserDTO {
  uuid: string;
  username: string;
  tag: string;
  avatarUrl: string;

  constructor(data: any) {
    this.uuid = data._id || data.uuid;
    this.username = data.username;
    this.tag = data.tag;
    this.avatarUrl = data.avatarUrl;
  }
}