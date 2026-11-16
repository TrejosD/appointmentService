import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { AppointmentInfo } from 'src/availability/entities/appointment_info.entity';
// revisar los cambios se elemino el serviceDate. Esta info estaria ahora en appointment

export type SpaceTimeDocument = HydratedDocument<SpaceTime,{reservationInfo: Types.DocumentArray<AppointmentInfo>}>;
@Schema()
export class SpaceTime {
  _id?: ObjectId;
  @Prop({
    index: true,
  })
  startTime: Date;
  @Prop({
    index: true,
  })
  endTime: Date;
  @Prop({
    index: true,
  })
  isAvailable: boolean;
  @Prop({
    index: true,
  })
  reservationId: string;
  @Prop({
    index: true,
  })
  reservationInfo: AppointmentInfo;
}

export const SpaceTimeSchema = SchemaFactory.createForClass(SpaceTime);
