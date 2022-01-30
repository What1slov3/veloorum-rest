import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateChatDTO {
  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsObject()
  chat: Record<string, any>;
}
