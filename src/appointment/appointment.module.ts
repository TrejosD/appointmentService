import { forwardRef, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities/appointment.entity';
import { AvailabilityModule } from 'src/availability/availability.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    forwardRef(() => AvailabilityModule),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    CustomerModule,
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
