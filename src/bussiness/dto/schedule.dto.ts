import { IsArray, IsNumber, IsPositive } from "class-validator";

export class ScheduleDto{
    @IsArray()
    @IsNumber()
    days: number[];
    @IsPositive()
    startYourney: number;
    @IsPositive()
    endYourney: number;
}