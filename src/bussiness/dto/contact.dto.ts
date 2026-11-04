import { IsArray, IsString } from "class-validator";

export class ContactDto{
    @IsString()
    email: string;
    @IsString()
    number: string;
    @IsArray()
    social: string[];
}