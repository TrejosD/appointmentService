import { IsOptional, IsString } from 'class-validator';

export class FindNearBussinessDto {
  @IsString()
  lat: string;
  @IsString()
  lng: string;
  @IsString()
  @IsOptional()
  page: string;
  @IsString()
  @IsOptional()
  limit: string;
}
