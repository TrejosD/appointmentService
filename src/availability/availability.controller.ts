import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
// import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
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
// todo problema, estos 2 metodos reciben el mismo parametro. Como identificar cual de los 2 se ejecutan?
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.findOne(id);
  }

  @Get(':id')
  findAvailabilityByBussiness(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.findAvaByBussID(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, updateAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.availabilityService.remove(id);
  }
}
