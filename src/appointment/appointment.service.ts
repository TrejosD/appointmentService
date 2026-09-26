import {
  BadRequestException,
  ConflictException,
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
} from './entities/appointment.entity';
import { Model, isValidObjectId } from 'mongoose';
import { AvailabilityService } from 'src/availability/availability.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @Inject(forwardRef(() => AvailabilityService))
    private readonly availabilityService: AvailabilityService,
    private readonly notificationsService: NotificationsService,
  ) {}
  // metodo agenda una cita, en el espacio ID seleccionado "AvailabilitySpace". **Si el producto, necesita un tiempo mayor a un solo sloth de tiempo, agenda el siguiente espacio automaticamente si esta disponible, sino, error.
  async create(id: string, createAppointmentDto: CreateAppointmentDto) {
    const app = {
      slothID: createAppointmentDto.slothID,
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
      console.log('Lista la cita');
      console.log(spaceUpdated);
      // todo aca deberia enviar la notificacion que se agendo la cita
      // tengo el bussinessID, deberia de tener un ligamen de que user es dueño del bussiness o algo asi, para tomar los pushTOken
      return spaceUpdated;
    } catch (error) {
      await this.remove(newApp._id.toString());
      if (error instanceof Error) {
        if (error.name == 'BadRequestException') {
          throw new BadRequestException(error.message);
        }
        if (error.name == 'NotFoundException') {
          throw new NotFoundException(error.message);
        }
        if (error.name == 'ConflictException') {
          throw new ConflictException(error.message);
        }
      }
    }
  }
  // metodo retorna todas las citas. appointment
  async findAll() {
    const allApp = await this.appointmentModel.find({});
    return allApp;
  }

  // metodo retorna una cita, de acuerdo al ID
  async findOne(term: string) {
    let app: Appointment | null = null;
    try {
      if (isValidObjectId(term)) {
        app = await this.appointmentModel.findById(term);
      }
      if (!app) {
        app = await this.appointmentModel.findOne({ customerID: term });
      }
      if (!app) {
        app = await this.appointmentModel.findOne({ startTime: term });
      }
      return app;
    } catch (error) {
      throw new NotFoundException(
        `Appointment: ${term} not found - Error: ${error}`,
      );
    }
  }

  async findOneByUserId(id: string) {
    try {
      const app = await this.findOne(id);
      return app;
    } catch (error) {
      throw new NotFoundException(
        `Appointment with id: ${id} not found - Error: ${error}`,
      );
    }
  }
  // metodo para editar un espacio de cita
  // todo dar la posibilidad al usuario de editar su cita
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointmentToUpdate = await this.findOne(id);
    if (appointmentToUpdate == null) {
      throw new NotFoundException('Appointment Spaces not found');
    }
    appointmentToUpdate?.updateOne(updateAppointmentDto);
    return appointmentToUpdate;
  }

  // todo listo el metodo, vamos a probar
  async remove(id: string) {
    const appointment = await this.appointmentModel.findById(id);
    if (!appointment) throw new NotFoundException('Appointment not found');
    const ava = await this.availabilityService.findOne(
      appointment.startTime.toISOString(),
    );
    if (!ava) throw new NotFoundException('Availability not found');
    await this.availabilityService.freeAvailabilitySpace(ava, appointment, id);
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

  // todo, este metodo, debe liberar el espacio de cita, pero tambien eliminar el reservation
  // async freeAppointmentSpace(id: string, appointment: Appointment) {
  //   try {
  //     const freeSpace = await this.availabilityService.freeAvailabilitySpace(
  //       id,
  //       appointment,
  //     );
  //     return freeSpace;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new BadRequestException('Appointment Space were not free', error);
  //     }
  //   }
  // }
}
