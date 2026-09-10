import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  bussinessID: string;
  @IsString()
  customerID: string;
  @IsString()
  productID: string;
  @IsString()
  dayDate: Date;
  @IsString()
  startTime: Date;
}
