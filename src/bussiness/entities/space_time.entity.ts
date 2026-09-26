import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
// revisar los cambios se elemino el serviceDate. Esta info estaria ahora en appointment
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
}

export const SpaceTimeSchema = SchemaFactory.createForClass(SpaceTime);
