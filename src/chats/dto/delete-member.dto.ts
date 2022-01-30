import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class DeleteMemberDTO {
  @IsNotEmpty()
  @IsArray()
  cid: string[];

  @IsNotEmpty()
  @IsArray()
  uid: string[];

  constructor(data: any) {
    this.cid = data.cid;
    this.uid = data.uid;
  }
}
