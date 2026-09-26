import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type FollowerDocument = HydratedDocument<Follower>;
@Schema()
export class Follower extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Bussiness',
  })
  bussinessId: Types.ObjectId;
  @Prop({
    requered: true,
    ref: 'User',
    default: '',
  })
  userFollower: string[];
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
