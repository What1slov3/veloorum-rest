import {
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  owningChannelId: string;

  @IsArray()
  members?: string[];
}
