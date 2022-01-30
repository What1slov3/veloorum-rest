import { IsNotEmpty, IsString } from "class-validator";

export class JoinLeaveChannelDTO {
  @IsString()
  @IsNotEmpty()
  cid: string;
}