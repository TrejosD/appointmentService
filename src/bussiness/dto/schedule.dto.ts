import { IsArray, IsNumber, IsPositive } from "class-validator";

export class ScheduleDto{
    @IsArray()
    @IsPositive()
    days: number[];
    @IsPositive()
    startYourney: number;
    @IsPositive()
    endYourney: number;
}