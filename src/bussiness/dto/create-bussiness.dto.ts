import { IsString, MinLength } from 'class-validator';

export class CreateBussinessDto {
  @IsString()
  @MinLength(1)
  name: string;
  @IsString()
  @MinLength(8)
  description: string;
  @IsString()
  @MinLength(8)
  address: string;
}
