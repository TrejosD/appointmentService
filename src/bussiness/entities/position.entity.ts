import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product, ProductSchema } from './product.entity';
@Schema({ _id: false })
export class Position extends Document {
  @Prop({
    index: true,
  })
  name: string;
  @Prop({
    index: true,
  })
  schedule: string;
  @Prop({
    type: [ProductSchema],
    index: true,
  })
  products: Product[];
}

export const PositionSchema = SchemaFactory.createForClass(Position);
