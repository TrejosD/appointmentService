import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export enum AppointmentStatus {
  agended,
  inProcess,
  ended,
}

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment extends Document {
  @Prop({
    index: true,
  })
  bussinessID: string;
  @Prop({
    index: true,
  })
  customerID: string;
  @Prop({
    index: true,
  })
  productID: string;
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
  status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
