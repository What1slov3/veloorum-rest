import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  _id: String;

  @Prop({
    required: true,
    validate: {
      validator: (type: string) => {
        if (!['channel', 'dm'].includes(type)) return false;
        return true;
      },
    },
  })
  type: String;

  @Prop({ required: true, maxlength: 48 })
  title: String;

  @Prop({ required: true })
  members: [String];

  @Prop({ required: true })
  allTimeMembers: [String];

  @Prop({ default: '' })
  iconUrl: String;

  @Prop(raw({}))
  channelConfig: Record<string, any>;

  @Prop({ default: [] })
  chats: [String];

  @Prop({ required: true })
  ownerId: String;

  @Prop({ default: '' })
  description: String;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
