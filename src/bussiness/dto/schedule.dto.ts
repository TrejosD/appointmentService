import { IsArray, IsNumber, IsPositive, IsString } from "class-validator";

export class ScheduleDto{
    @IsArray()
    days: number[];
    @IsString()
    startYourney: string;
    @IsString()
    endYourney: string;
}