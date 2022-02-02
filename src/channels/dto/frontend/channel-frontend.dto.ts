export class ChannelFrontendDTO {
  ownerId: string;
  chats: string[];
  iconUrl: string;
  title: string;
  type: string;
  uuid: string;
  members: string[];
  description: string;
  systemChat: string;

  constructor(data: any) {
    this.ownerId = data.ownerId;
    this.chats = data.chats;
    this.iconUrl = data.iconUrl;
    this.title = data.title;
    this.type = data.type;
    this.uuid = data._id || data.uuid;
    this.members = data.members;
    this.description = data.description;
    this.systemChat = data.systemChat;
  }
}
