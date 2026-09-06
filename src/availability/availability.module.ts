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

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  imports: [
    BussinessModule,
    forwardRef(() => AppointmentModule),
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
