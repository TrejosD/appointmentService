import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from './entities/appointment.entity';
import { Model } from 'mongoose';
import { AvailabilityService } from 'src/availability/availability.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @Inject(forwardRef(() => AvailabilityService))
    private readonly availabilityService: AvailabilityService,
  ) {}
  async create(id: string, createAppointmentDto: CreateAppointmentDto) {
    const app = {
      status: AppointmentStatus.inProcess,
      bussinessID: createAppointmentDto.bussinessID,
      customerID: createAppointmentDto.customerID,
      productID: createAppointmentDto.productID,
      startTime: createAppointmentDto.startTime,
    };
    const newApp = await this.appointmentModel.create({ ...app });
    try {
      const spaceUpdated = await this.availabilityService.updateAppointment(
        id,
        newApp,
      );
      return spaceUpdated;
    } catch (error) {
      await this.remove(newApp._id.toString());
      console.log(error);
      throw new BadRequestException(
        'Espacio para cita no disponible - check logs',
      );
    }
  }

  async findAll() {
    const allApp = await this.appointmentModel.find({});
    return allApp;
  }

  async findOne(id: string) {
    try {
      const app = await this.appointmentModel.findById(id);
      return app;
    } catch (error) {
      throw new NotFoundException(
        `Appointment with id: ${id} not found - Error: ${error}`,
      );
    }
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appToUpdate = await this.findOne(id);
    if (appToUpdate == null) {
      throw new NotFoundException('Appointment Spaces not found');
    }
    appToUpdate?.updateOne(updateAppointmentDto);
    return appToUpdate;
  }

  async remove(id: string) {
    const { deletedCount } = await this.appointmentModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Appointment with id: ${id} not found`);
    }
    return 'Appointment Deleted';
  }

  async updateEndTime(id: string, time: Date) {
    const app = await this.findOne(id);
    app!.endTime = time;
    await app?.save();
  }
}
