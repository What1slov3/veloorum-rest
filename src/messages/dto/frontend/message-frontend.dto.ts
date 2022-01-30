export class MessageFrontendDTO {
  context: Record<string, any>;
  content: Record<string, any>;
  ownerId: string;
  uuid: string;
  createdAt: number;
  updatedAt: number;
  type?: string;
  systemType?: string;

  constructor(data: any) {
    this.content = data.content;
    this.context = data.context;
    this.ownerId = data.ownerId;
    this.uuid = data._id || data.uuid;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.type = data.type;
    this.systemType = data.systemType;
  }
}