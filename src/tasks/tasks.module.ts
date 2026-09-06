import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { BussinessModule } from 'src/bussiness/bussiness.module';
import { AvailabilityModule } from 'src/availability/availability.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [BussinessModule, AvailabilityModule],
})
export class TasksModule {}
