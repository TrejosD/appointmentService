import { IsString } from 'class-validator';

export class CreateAppByBussDto {
  @IsString()
  customerID: string;
  @IsString()
  productID: string;
  @IsString()
  dayDate: string;
  @IsString()
  startTime: string;
}
