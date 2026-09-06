import { IsString } from 'class-validator';

export class CreateAvailabilityDto {
  @IsString()
  bussinessID: string;
}
