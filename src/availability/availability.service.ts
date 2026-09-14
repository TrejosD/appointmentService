import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import {
  Availability,
  AvailabilityDocument,
} from './entities/availability.entity';
import { Model, Connection } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BussinessService } from 'src/bussiness/bussiness.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { SpaceTime } from 'src/bussiness/entities/space_time.entity';
import { AppointmentService } from 'src/appointment/appointment.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    @Inject(forwardRef(() => AppointmentService))
    private readonly availabilityModel: Model<AvailabilityDocument>,
    private readonly bussinessService: BussinessService,
    private readonly appointmentService: AppointmentService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  // este metodo deberia crear un dia de espacios disponibles para citas
  async create(createAvailabilityDto: CreateAvailabilityDto) {
    const newAva = await this.createInfoToAvailabilityModel(
      createAvailabilityDto.bussinessID,
      new Date(),
    );
    return newAva;
  }
  // este metodo crea los dias necesarios de agenda, desde hoy a 14 dias
  populateEmptyAgendas(id: string) {
    const dates = this.createDayList(new Date());
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    dates.forEach(async (dayDate) => {
      const existDate = await this.findDatesAlreadyCreated(id, dayDate);
      if (!existDate) await this.createInfoToAvailabilityModel(id, dayDate);
    });
  }

  async findDatesAlreadyCreated(id: string, dayDate: Date): Promise<boolean> {
    const avas = await this.findAvaByBussID(id);
    return avas.some((ava) => {
      const avaDate = this.cleanDate(ava.dayDate);
      const dateToCompare = this.cleanDate(dayDate);
      return new Date(avaDate).getTime() === new Date(dateToCompare).getTime();
    });
  }

  async createInfoToAvailabilityModel(id: string, dayDate: Date) {
    const buss = await this.bussinessService.findOne(id);
    if (buss != null) {
      const slots = this.createEmptyAgenda(
        dayDate,
        buss.schedule.startYourney,
        buss.schedule.endYourney,
        buss?.defaultAppointmentTime,
      );
      const infoNeeded = {
        bussinessID: id,
        dayDate: dayDate,
        slots: slots,
      };
      const newAva = await this.availabilityModel.create({ ...infoNeeded });
      return newAva;
    }
  }

  cleanDate(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  createDayList(today: Date): Date[] {
    const dateList: Date[] = [];
    for (let i = 0; i < 10; i++) {
      const newToday = today;
      const dateTosave = newToday.setDate(newToday.getDate() + 1);
      const ii = new Date(dateTosave);
      dateList.push(ii);
    }
    return dateList;
  }
  // metodo escuentra todos los espacios availability para un bussiness
  async findAvaByBussID(id: string) {
    const allAvas = await this.findAll();
    return allAvas.filter((ava) => ava.bussinessID === id);
  }
  // metodo retorna todos los espacios availability
  async findAll() {
    const ava = await this.availabilityModel.find({});
    return ava;
  }
  // metodo busca un availability con el ID
  async findOne(id: string) {
    try {
      const ava = await this.availabilityModel.findById(id);
      return ava;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Availability not found`);
    }
  }

  update(id: string, updateAvailabilityDto: UpdateAvailabilityDto) {
    return `Metod not performed ${id}`;
  }

  async updateAppointment(id: string, appointment: Appointment) {
    const product = await this.bussinessService.findProductByID(
      appointment.bussinessID,
      appointment.productID,
    );
    if (product == null) {
      throw new NotFoundException(`Product not found`);
    }
    const newApp = await this.updateAgendaSpace(appointment, product.time, id);
    return newApp;
  }

  async remove(id: string) {
    const { deletedCount } = await this.availabilityModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new NotFoundException(`Agenda space not found - ID: ${id}`);
    }
    return `Removed - true`;
  }

  async updateAgendaSpace(appointment: Appointment, time: number, id: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const buss = await this.bussinessService.findOne(appointment.bussinessID);
      const ava = await this.findOne(id);
      if (ava == null || buss == null) {
        throw new NotFoundException(
          `Espacio no encontrado, Incorrect Bussiness ID`,
        );
      }
      const slots = ava?.slots;
      const startTime = appointment.startTime;
      const neededTime = time;
      const timeForDate = buss.defaultAppointmentTime;
      let blocksNeeded = neededTime / timeForDate;
      if (blocksNeeded <= 1) {
        blocksNeeded = 1;
      }
      const spaceTime = this.getConsecutiveSlots(
        slots,
        startTime,
        blocksNeeded,
      );
      spaceTime?.forEach((item) => {
        const startTime = new Date(appointment.startTime).getTime();
        item.isAvailable = false;
        item.endTime = new Date(startTime + neededTime * 60000);
        item.reservationId = appointment._id.toString();
      });
      ava.markModified('slots');
      await ava?.save({ session });
      await session.commitTransaction();
      const appEndTime = new Date(startTime.getTime() + neededTime * 60000);
      await this.appointmentService.updateEndTime(
        appointment._id.toString(),
        appEndTime,
      );
      return spaceTime;
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error catched on updateagendaSpace 182');
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`Cause ${error.cause}`);
        console.log(`Name ${error.name}`);
        console.log(`Message ${error.message}`);
        console.log(`Stack ${error.stack}`);
        throw new BadRequestException(error.message);
      }
    } finally {
      await session.endSession();
    }
  }
  // este metodo, retorna una lista con los espacios para cita, de acuerdo al tiempo del producto
  getConsecutiveSlots(
    agenda: SpaceTime[],
    startTime: Date,
    blocksNeeded: number,
  ): SpaceTime[] | null {
    // encuentra el bloque inicial de acuerda a la hora de cita
    const startIndex = agenda.findIndex(
      (item) =>
        new Date(item.startTime).getTime() === new Date(startTime).getTime(),
    );
    // si el index es -1, no existe. null
    if (startIndex === -1) return null;
    // creo una lista nueva con los espacios necesarios para la cita
    const slots = agenda.slice(startIndex, startIndex + blocksNeeded);
    // si no tenemos los espacios necesarios. null
    if (slots.length !== blocksNeeded) return null;
    // todo salio bien, creo una lista con los slots necesarios para la cita.
    const consecutive = slots.every((slot, index) => {
      // esto debe darnos BadRequest, cuando apartir de segun espacio No esta disponible.
      if (!slot.isAvailable && index !== 0) {
        console.log('211 error catched on getConsecutive');
        throw new BadRequestException(
          `Ventana de tiempo insuficente para el servicio seleccionado`,
        );
      }
      // esto nos debe dar NotFound, cuando el primer espacio no esta disponible
      if (!slot.isAvailable) {
        console.log('218 error catched on getConsecutive');
        throw new NotFoundException(`Espacio para cita no disponible`);
      }
      // si todo sale bien retornamos el espacio
      if (index === 0) {
        return true;
      }
      return slot.startTime.getTime() === slots[index - 1].endTime.getTime();
    });
    // este ternario, si consecutive is true, retorno los slots sino null.
    return consecutive ? slots : null;
  }

  createEmptyAgenda(
    today: Date, //fecha del dia
    startYourney: number, //number ex: 8 == 8:00 am
    endYourney: number, //number ex 17 == 17:00 / 5:00 pm
    timeSpace: number = 30,
  ): {
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    reservationID?: string;
  }[] {
    // configurar el inicio y fin laboral
    const dayAgenda: {
      startTime: Date;
      endTime: Date;
      isAvailable: boolean;
      reservationID?: string;
    }[] = [];
    const nowTime = new Date(today);
    nowTime.setHours(startYourney, 0, 0, 0);
    const endYourneyTime = new Date(today);
    endYourneyTime.setHours(endYourney, 0, 0, 0);
    // interar en bloques de tiempo de 30 minutos
    while (nowTime < endYourneyTime) {
      const blockStart = new Date(nowTime);
      const blockEnds = new Date(nowTime);
      blockEnds.setMinutes(blockEnds.getMinutes() + timeSpace);
      dayAgenda.push({
        startTime: blockStart,
        endTime: blockEnds,
        isAvailable: true,
        reservationID: undefined,
      });
      // pasar al siguiente bloque
      nowTime.setMinutes(nowTime.getMinutes() + timeSpace);
    }
    return dayAgenda;
  }
}
