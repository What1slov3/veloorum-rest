export class ChatFrontendDTO {
  uuid: string;
  title: string;
  members: string[];
  history: any[]; // TODO сменить any на message
  owningChannelId: string;

  constructor(data: any) {
    this.uuid = data._id || data._uuid;
    this.title = data.title;
    this.members = data.members;
    this.history = [];
    this.owningChannelId = data.owningChannelId;
  }
}
