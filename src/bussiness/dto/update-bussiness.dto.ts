import { PartialType } from '@nestjs/mapped-types';
import { CreateBussinessDto } from './create-bussiness.dto';
import { IsOptional, IsString } from 'class-validator';
import { CompassGPS, Position, Product, Schedule, Contact } from '../entities';


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
  @IsOptional()
  compassGPS?: CompassGPS;
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
