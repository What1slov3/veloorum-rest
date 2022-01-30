import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InviteDocument = Invite & Document;

@Schema()
export class Invite {
  @Prop({required: true, unique: true})
  url: String;

  @Prop({required: true, unique: true})
  cid: String;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);