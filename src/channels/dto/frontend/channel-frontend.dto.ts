export class ChannelFrontendDTO {
  ownerId: string;
  chats: string[];
  iconUrl: string;
  title: string;
  type: string;
  uuid: string;
  members: string[];

  constructor(data: any) {
    this.ownerId = data.ownerId;
    this.chats = data.chats;
    this.iconUrl = data.iconUrl;
    this.title = data.title;
    this.type = data.type;
    this.uuid = data._id || data.uuid;
    this.members = data.members;
  }
}
