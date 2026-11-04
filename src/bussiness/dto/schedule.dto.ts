import { IsArray, IsString } from "class-validator";

export class ScheduleDto{
    @IsArray()
    @IsString()
    days: string[];
    @IsString()
    startYourney: string;
    @IsString()
    endYourney: string;
}