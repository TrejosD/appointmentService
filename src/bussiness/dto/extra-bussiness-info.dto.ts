import { IsArray, IsPositive, } from "class-validator";
import { Product } from "../entities/product.entity";
import { Schedule } from "../entities/schedule.entity";

export class ExtraBussinessInfoDto{
    @IsArray()
    gpsData: string[];
    @IsArray()
    products: Product[];
    @IsPositive()
    defaultAppointmentTime: number;
    schedule: Schedule;

}