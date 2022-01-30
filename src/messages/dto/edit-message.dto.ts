import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from 'class-validator';

export class EditMessageDTO {
  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsString()
  @IsNotEmpty()
  mid: string;

  @IsObject()
  @IsNotEmptyObject()
  content: {
    text: string;
  }
}