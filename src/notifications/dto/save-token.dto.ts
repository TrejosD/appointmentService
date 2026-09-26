import { IsString } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  userId: string;
  @IsString()
  pushToken: string;
}
