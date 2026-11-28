import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ _id: false })
export class Schedule {
  @Prop({
    index: true,
  })
  days: number[];
  @Prop({
    index: true,
  })
  startYourney: string;
  @Prop({
    index: true,
  })
  endYourney: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
