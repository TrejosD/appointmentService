import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { BussinessModule } from 'src/bussiness/bussiness.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [BussinessModule],
})
export class SeedModule {}
