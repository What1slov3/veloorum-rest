import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChannelDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  cid: string;
}
