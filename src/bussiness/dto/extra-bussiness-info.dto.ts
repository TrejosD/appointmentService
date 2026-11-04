import { IsArray, IsPositive, } from "class-validator";
import { Product } from "../entities/product.entity";
import { Schedule } from "../entities/schedule.entity";
import { CompassGPS } from "../entities";

export class ExtraBussinessInfoDto{
    @IsArray()
    compassGps: CompassGPS;
    @IsArray()
    products: Product[];
    @IsPositive()
    defaultAppointmentTime: number;
    schedule: Schedule;

}