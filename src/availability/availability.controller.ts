import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.findOne(id);
  }

  @Get('/bussiness/:id')
  findAvailabilityByBussiness(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.findAvaByBussID(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.remove(id);
  }
}
