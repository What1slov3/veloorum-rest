import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';
import { createUserTag } from 'src/common/createUserTag';
import validator from 'validator';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    default: () => {
      return randomUUID();
    },
  })
  _id: String;

  @Prop({
    required: true,
    validate: {
      validator: (username: string) => {
        if (username.includes('@')) return false;
        return true;
      },
    },
  })
  username: String;

  @Prop({ required: true })
  _passwordHash: String;

  @Prop({
    length: 4,
    default: () => {
      return createUserTag();
    },
  })
  tag: String;

  @Prop({
    required: true,
    trim: true,
    validate: {
      validator: (email: string) => {
        return validator.isEmail(email);
      },
      message: 'Not correct email',
    },
    unique: true,
  })
  email: String;

  @Prop({ default: [] })
  channels: [String];

  @Prop({
    default: '',
  })
  avatarUrl: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
