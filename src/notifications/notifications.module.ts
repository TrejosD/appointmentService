import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDevice, UserDeviceSchema } from './entities/user-device.entity';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/entities/appointment.entity';
import {
  Bussiness,
  BussinessSchema,
} from 'src/bussiness/entities/bussiness.entity';
import {
  Follower,
  FollowerSchema,
} from 'src/bussiness/entities/follower.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema },
      { name: User.name, schema: UserSchema },
      { name: UserDevice.name, schema: UserDeviceSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Bussiness.name, schema: BussinessSchema },
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  exports: [NotificationsService, MongooseModule],
})
export class NotificationsModule {}
