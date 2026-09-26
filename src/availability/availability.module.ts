import { forwardRef, Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Availability,
  AvailabilitySchema,
} from './entities/availability.entity';
import { BussinessModule } from 'src/bussiness/bussiness.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import {
  Bussiness,
  BussinessSchema,
} from 'src/bussiness/entities/bussiness.entity';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  imports: [
    BussinessModule,
    forwardRef(() => AppointmentModule),
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Bussiness.name, schema: BussinessSchema },
    ]),
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
