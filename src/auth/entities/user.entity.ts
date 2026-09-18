import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({
    index: true,
    unique: true,
  })
  email: string;
  @Prop({
    index: true,
  })
  password: string;
  @Prop({
    index: true,
  })
  fullName: string;
  @Prop({
    index: true,
    default: true,
  })
  isActive: boolean;
  @Prop({
    index: true,
    default: ['user'],
  })
  roles: string[];
// todo para crear un metodo parecido al @BeforeInsert seria en el create, transformar la entrada como necesite.
}

export const UserSchema = SchemaFactory.createForClass(User);
