import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Platforms } from '../interfaces/platforms.interface';

export type UserDeviceDocument = HydratedDocument<UserDevice>;

@Schema()
export class UserDevice {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;
  @Prop({
    required: true,
  })
  deviceId: string[];
  @Prop({
    required: true,
    enum: Platforms,
  })
  platform: Platforms[];
  @Prop({
    required: true,
  })
  pushToken: string[];
  @Prop({
    default: true,
  })
  isActive:boolean;
}

export const UserDeviceSchema = SchemaFactory.createForClass(UserDevice);

UserDeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });
UserDeviceSchema.index({ pushToken: 1 });
