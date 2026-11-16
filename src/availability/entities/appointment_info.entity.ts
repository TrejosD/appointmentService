import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({_id: false})
export class AppointmentInfo {
    @Prop({
        index: true,
    })
    fullName: string;
    @Prop({
        index: true,
    })
    userId: string;
    @Prop({
        index: true,
    })
    productId: string;
    @Prop({
        index: true,
    })
    serviceName: string;
}

export const AppointmentInfoSchema = SchemaFactory.createForClass(AppointmentInfo);