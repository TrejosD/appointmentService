import { IsNumber, IsPositive, IsString } from "class-validator";

export class ServicesDto{
    @IsString()
    name:string;
    @IsPositive()
    time: number;
    @IsPositive()
    price: number;
}