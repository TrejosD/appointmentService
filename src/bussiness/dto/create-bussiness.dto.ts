import { IsString, MinLength } from 'class-validator';
import { Contact } from '../entities/contact.entity';

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
}
