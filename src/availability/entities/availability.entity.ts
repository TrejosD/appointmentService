import { Document, HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import {
  SpaceTime,
  SpaceTimeSchema,
} from 'src/bussiness/entities/space_time.entity';

export type AvailabilityDocument = HydratedDocument<Availability>;

@Schema()
export class Availability extends Document {
  @Prop({
    index: true,
  })
  bussinessID: string;
  @Prop({
    index: true,
  })
  dayDate: Date;
  @Prop({
    type: [SpaceTimeSchema],
    index: true,
  })
  slots: SpaceTime[];
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

/*el Json de este objeto se deberia ver asi

{
bussinessId: asdlkjasldjs,
dayDate: 2026/08/21,
slots:[
{_id:adsasdasd,
startTime: 9:00 am,
endTime: 9:30 am,
isAvailable: true,
},
{_id:adsasdasd,
startTime: 9:30 am,
endTime: 10:00 am,
isAvailable: false,
reservationId: asdasd
}]}
 */
