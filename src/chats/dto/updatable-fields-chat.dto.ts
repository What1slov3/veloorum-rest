import { IsString } from "class-validator";

export class UpdatableFieldsChatDTO {
  title: string;
  members: string[];
  owningChannelId: string;

  constructor(data: any) {
    this.title = data.title;
    this.members = data.members;
    this.owningChannelId = data.owningChannelId;
  }
}