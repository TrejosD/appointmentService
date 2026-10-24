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
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import {
  CreateBussinessDto,
  UpdateBussinessDto,
  FindNearBussinessDto,
  ExtraBussinessInfoDto,
} from './dto';

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

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.bussinessService.findOneById(id);
  }

  @Get('/near')
  findNearBussinesses(@Body() findNearBussinessDto: FindNearBussinessDto) {
    return this.bussinessService.findNearBussiness(findNearBussinessDto);
  }

  @Get('/find/:term')
  findBussinesByTerm(@Param('term') term: string) {
    return this.bussinessService.findBussinessByTerm(term);
  }

  @Patch('/update/:id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateBussinessDto: UpdateBussinessDto,
  ) {
    return this.bussinessService.update(id, updateBussinessDto);
  }

  @Patch('/add/:id')
  addExtraInfo(@Param('id', ParseMongoIdPipe) id: string,
@Body() extraBussinessInfoDto: ExtraBussinessInfoDto ){
  return this.bussinessService.addExtraBussinesInfo(id,extraBussinessInfoDto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bussinessService.remove(id);
  }
}
