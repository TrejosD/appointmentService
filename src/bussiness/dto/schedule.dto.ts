import { IsArray, IsNumber, IsPositive } from "class-validator";

export class ScheduleDto{
    @IsArray()
    days: number[];
    @IsPositive()
    startYourney: number;
    @IsPositive()
    endYourney: number;
}