import { randomUUID } from 'crypto';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  _id: String;

  @Prop({ required: false })
  ownerId: String;

  @Prop({
    default: 'user',
    validate: {
      validator: (type: string) => {
        return ['user', 'system'].includes(type);
      },
    },
  })
  type: String;

  @Prop({
    required: false,
    validate: {
      validator: (type: string) => {
        return ['new_user'].includes(type);
      },
    },
  })
  systemType: String;

  @Prop(
    raw({
      text: {
        type: String,
        required: false,
        trim: true,
        max: 4000,
      },
      targetUser: {
        type: String,
        required: false,
      },
      attachments: {
        type: [String],
        required: false,
      },
    }),
  )
  content: Record<string, any>;

  @Prop(
    raw({
      chatId: {
        type: String,
        required: true,
      },
      channelId: {
        type: String,
        required: true,
      },
    }),
  )
  context: Record<string, any>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
