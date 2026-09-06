import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BussinessService } from './bussiness.service';
import { CreateBussinessDto } from './dto/create-bussiness.dto';
import { UpdateBussinessDto } from './dto/update-bussiness.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('bussiness')
export class BussinessController {
  constructor(private readonly bussinessService: BussinessService) {}

  @Post()
  create(@Body() createBussinessDto: CreateBussinessDto) {
    return this.bussinessService.create(createBussinessDto);
  }

  @Get()
  findAll() {
    return this.bussinessService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.bussinessService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateBussinessDto: UpdateBussinessDto,
  ) {
    console.log(`Bussines Controller`);
    return this.bussinessService.update(id, updateBussinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bussinessService.remove(id);
  }
}
