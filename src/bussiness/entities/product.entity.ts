import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema()
export class Product {
  _id?: ObjectId;
  @Prop({
    index: true,
  })
  name: string;
  @Prop({
    index: true,
  })
  time: number;
  @Prop({
    index: true,
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
