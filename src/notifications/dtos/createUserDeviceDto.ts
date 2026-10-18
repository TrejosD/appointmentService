import { IsString } from "class-validator"

//* deje solamente 2 entradas, para que no sea mandatorio mas info
export class CreateUserDeviceDto{
    @IsString()
    userId: string;
    @IsString()
    pushToken: string;
    // deviceId
    // platform
}