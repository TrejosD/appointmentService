import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Schedule {
  @Prop({
    index: true,
  })
  days: number[];
  @Prop({
    index: true,
  })
  startYourney: number;
  @Prop({
    index: true,
  })
  endYourney: number;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
