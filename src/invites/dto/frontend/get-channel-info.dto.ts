export class GetChannelInfoDTO {
  title: string;
  iconUrl: string;
  membersCount: number;
  uuid: string;

  constructor(data: any) {
    this.title = data.title;
    this.iconUrl = data.iconUrl;
    this.membersCount = data.membersCount;
    this.uuid = data.uuid || data._id;
  }
}
