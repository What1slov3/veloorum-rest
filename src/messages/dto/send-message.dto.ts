import { IsNotEmptyObject } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmptyObject()
  content: {
    text: string;
    attachments?: string[];
  };

  @IsNotEmptyObject()
  context: {
    chatId: string;
    channelId: string;
  };
}
