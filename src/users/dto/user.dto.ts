import {IsEmail, IsString, IsNotEmpty, IsUUID, IsUrl, IsArray} from 'class-validator';

class UserDTO {
  @IsUUID('all')
  _id: string;

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
}

export default UserDTO;