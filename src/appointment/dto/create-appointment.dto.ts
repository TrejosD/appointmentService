import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  bussinessID: string;
  @IsString()
  customerID: string;
  @IsString()
  serviceID: string;
  @IsString()
  dayDate: Date;
  @IsString()
  startTime: Date;
}
