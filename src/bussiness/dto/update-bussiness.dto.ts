import { PartialType } from '@nestjs/mapped-types';
import { CreateBussinessDto } from './create-bussiness.dto';
import { IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/position.entity';
import { Product } from '../entities/product.entity';
import { SpaceTime } from '../entities/space_time.entity';

export class UpdateBussinessDto extends PartialType(CreateBussinessDto) {
  @IsString()
  @IsOptional()
  urlGPS?: string;
  @IsOptional()
  positions?: [Position];
  @IsOptional()
  products?: [Product];
  @IsString()
  @IsOptional()
  schedule?: string;
  @IsOptional()
  agenda?: [SpaceTime];
  @IsString()
  @IsOptional()
  contactInfo?: string;
}
