import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class SystemMessageDTO {
  @IsNotEmptyObject()
  content: {
    text: string;
    targetUser?: string;
  };

  @IsNotEmptyObject()
  context: {
    chatId: string;
    channelId: string;
  };

  @IsNotEmpty()
  @IsString()
  systemType: string;

  @IsNotEmpty()
  @IsString()
  system: true;

  constructor(data: any) {
    this.content = data.content;
    this.context = data.context;
    this.systemType = data.systemType;
  }
}
