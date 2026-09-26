import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDevice, UserDeviceSchema } from './entities/user-device.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema },
    ]),
  ],
  exports: [NotificationsService, MongooseModule],
})
export class NotificationsModule {}
