import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeedModule } from './seed/seed.module';
import { BussinessModule } from './bussiness/bussiness.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentModule } from './appointment/appointment.module';
import { TasksModule } from './tasks/tasks.module';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    BussinessModule,
    ScheduleModule.forRoot(),
    TasksModule,
    MongooseModule.forRoot(process.env.MONGODB!, {
      dbName: 'appointmentService',
    }),
    SeedModule,
    AvailabilityModule,
    AppointmentModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
