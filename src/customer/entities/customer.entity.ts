import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;
@Schema()
export class Customer extends Document {
  @Prop({
    index: true,
  })
  nombre: string;
  @Prop({
    index: true,
  })
  gender: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
