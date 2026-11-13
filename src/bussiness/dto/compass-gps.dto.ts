import { ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsNumber, IsString } from 'class-validator';

export class CompassGpsDto {
  @IsString()
  @IsIn(['Point']) // Valida que estrictamente diga 'Point'
  type: string;

  @IsArray()
  @ArrayMinSize(2) // Debe tener exactamente 2 elementos [lng, lat]
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true }) // Valida que ambos elementos sean números
  coordinates: number[];
}
