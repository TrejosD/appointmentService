import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({_id: false})
export class CompassGPS{
    @Prop({
        index: true,
    })
    type: string;
    @Prop({
        index: true,
    })
    coordinates:number[];
}

export const CompassGPSSchema = SchemaFactory.createForClass(CompassGPS)