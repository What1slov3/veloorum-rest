import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMessageDTO {
  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsString()
  @IsNotEmpty()
  mid: string;
}
