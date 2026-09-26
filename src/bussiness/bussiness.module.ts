import { Module } from '@nestjs/common';
import { BussinessService } from './bussiness.service';
import { BussinessController } from './bussiness.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bussiness, BussinessSchema } from './entities/bussiness.entity';
import { FollowerSchema, Follower } from './entities/follower.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bussiness.name, schema: BussinessSchema },
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  controllers: [BussinessController],
  providers: [BussinessService],
  exports: [BussinessService, MongooseModule],
})
export class BussinessModule {}
