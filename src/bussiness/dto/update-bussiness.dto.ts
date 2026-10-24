import { PartialType } from '@nestjs/mapped-types';
import { CreateBussinessDto } from './create-bussiness.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/position.entity';
import { Product } from '../entities/product.entity';
import { SpaceTime } from '../entities/space_time.entity';
import { Schedule } from '../entities/schedule.entity';
import { Contact } from '../entities/contact.entity';

export class UpdateBussinessDto extends PartialType(CreateBussinessDto) {
  @IsString()
  @IsOptional()
  name?:string;
  @IsString()
  @IsOptional()
  description?:string;
  @IsString()
  @IsOptional()
  address?:string;
  @IsArray()
  @IsOptional()
  gpsData?: string[];
  @IsOptional()
  positions?: [Position];
  @IsOptional()
  products?: [Product];
  @IsOptional()
  schedule?: Schedule;
  @IsString()
  @IsOptional()
  defaultTime?: string;
  @IsOptional()
  contactInfo?: Contact;
}
