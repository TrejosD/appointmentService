import { IsPositive, IsString, MinLength } from 'class-validator';
import { Contact } from '../entities/contact.entity';
import { Product, Schedule } from '../entities';

export class CreateBussinessDto {
  @IsString()
  userId: string;
  @IsString()
  @MinLength(1)
  name: string;
  @IsString()
  @MinLength(8)
  description: string;
  @IsString()
  @MinLength(8)
  address: string;
  contactInfo: Contact;
  products: Product[];
  @IsPositive()
  defaultAppointmentTime: number;
  schedule: Schedule;

}
