import { IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  nombre: string;
  @IsString()
  @MinLength(1)
  gender: string;
}
