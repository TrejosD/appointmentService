import { forwardRef, Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities/appointment.entity';
import { AvailabilityModule } from 'src/availability/availability.module';
import { AuthModule } from 'src/auth/auth.module';
import { BussinessModule } from 'src/bussiness/bussiness.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [
    forwardRef(() => AvailabilityModule),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    BussinessModule,
    AuthModule,
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
