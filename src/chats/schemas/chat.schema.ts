import { Prop, Schema, raw, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  _id: String;

  @Prop({
    required: true,
    validate: {
      validator: (title: string) => {
        if (title.includes('#')) return false;
        return true;
      },
    },
  })
  title: String;

  // _config: String;

  @Prop({ required: true })
  members: [String];

  @Prop(
    raw({
      messageCount: {
        type: Number,
        default: 0,
      },
    }),
  )
  stats: Record<string, any>;

  @Prop({ required: true, type: Types.ObjectId, ref: 'channels' })
  owningChannelId: String;

  @Prop({
    default: [],
    ref: 'messages',
  })
  history: [String];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
