import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAppByBussDto } from './dto/create_by_buss-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post(':id')
  create(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.create(id, createAppointmentDto);
  }

  @Post('/bussiness/:id')
  createByBuss(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() createByBuss: CreateAppByBussDto,
  ) {
    return this.appointmentService.createByBuss(id, createByBuss);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.appointmentService.findOne(id);
  }

  @Get('/user/:id')
  findByUserId(@Param('id', ParseMongoIdPipe) id: string) {
    return this.appointmentService.findOneByUserId(id);
  }

  @Patch('/:id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.appointmentService.remove(id);
  }
}
