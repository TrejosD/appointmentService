import { IsArray, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';
import { Product, Schedule } from '../entities';
import { ContactDto } from './contact.dto';
import { Type } from 'class-transformer';
import { ServicesDto } from './services.dto';
import { ScheduleDto } from './schedule.dto';

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
  @ValidateNested()
  @Type(()=> ContactDto)
  contactInfo: ContactDto ;
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=>ServicesDto)
  products: ServicesDto[];
  @IsPositive()
  defaultAppointmentTime: number;
  @ValidateNested()
  @Type(()=>ScheduleDto)
  schedule: ScheduleDto;

}
