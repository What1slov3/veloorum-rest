export class ChatUpdatedFrontendDTO {
  uuid: string;
  title: string;
  members: string[];

  constructor(data: any) {
    this.uuid = data._id || data._uuid;
    this.title = data.title?.slice(0, 32);
    this.members = data.members;
  }
}
