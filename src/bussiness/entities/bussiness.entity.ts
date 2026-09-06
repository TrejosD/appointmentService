import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Position, PositionSchema } from './position.entity';
import { Product, ProductSchema } from './product.entity';
import { Schedule, ScheduleSchema } from './schedule.entity';
import { Contact, ContactSchema } from './contact.entity';

export type BussinessDocument = HydratedDocument<
  Bussiness,
  {
    product: Types.DocumentArray<Product>;
    contact: Types.DocumentArray<Contact>;
    schedule: Types.DocumentArray<Schedule>;
  }
>;
@Schema()
export class Bussiness extends Document {
  @Prop({
    index: true,
  })
  name: string;
  @Prop({
    index: true,
  })
  description: string;
  @Prop({
    index: true,
  })
  address: string;
  @Prop({
    index: true,
  })
  urlGPS: string;
  @Prop({
    type: [PositionSchema],
    index: true,
  })
  positions: Position[];
  @Prop({
    type: [ProductSchema],
    index: true,
  })
  products: Product[];
  @Prop({
    index: true,
  })
  defaultAppointmentTime: number = 30;
  @Prop({
    type: ScheduleSchema,
    index: true,
  })
  schedule: Schedule;
  @Prop({
    type: ContactSchema,
    index: true,
  })
  contactInfo: Contact;
  @Prop({
    index: true,
  })
  doneServices: number;
  @Prop({
    index: true,
  })
  customerComments: string[];
  @Prop({
    index: true,
  })
  followers: number;
  @Prop({
    index: true,
  })
  rate: number;
}
export const BussinessSchema = SchemaFactory.createForClass(Bussiness);
