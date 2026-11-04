import { IsString } from "class-validator";

export class ServicesDto{
    @IsString()
    name:string;
    @IsString()
    time: string;
    @IsString()
    price:string;
}