import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Contact {
  @Prop({
    index: true,
  })
  email: string;
  @Prop({
    index: true,
  })
  number: string;
  @Prop({
    index: true,
  })
  social: string[];
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
