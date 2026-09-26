import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import {
  Availability,
  AvailabilityDocument,
} from './entities/availability.entity';
import { Model, Connection, isValidObjectId } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BussinessService } from 'src/bussiness/bussiness.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { SpaceTime } from 'src/bussiness/entities/space_time.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import {
  Bussiness,
  BussinessDocument,
} from 'src/bussiness/entities/bussiness.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    @Inject(forwardRef(() => AppointmentService))
    private readonly availabilityModel: Model<AvailabilityDocument>,
    @InjectModel(Bussiness.name)
    private readonly bussinessModel: Model<BussinessDocument>,
    private readonly bussinessService: BussinessService,
    private readonly appointmentService: AppointmentService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  // todo que al eliminarse una cita, el espacio vuelva a ser disponible

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
      // revisamos si la fecha "dayDate" actual existe
      const existDate = await this.findDatesAlreadyCreated(id, dayDate);
      // si la fecha actual no existe, la creamos
      if (!existDate) await this.createInfoToAvailabilityModel(id, dayDate);
    });
  }
  // metodo revisa los espacios de agenda creados actualmente
  async findDatesAlreadyCreated(id: string, dayDate: Date): Promise<boolean> {
    const avas = await this.findAvaByBussID(id);
    return avas.some((ava) => {
      const avaDate = this.cleanDate(ava.dayDate);
      const dateToCompare = this.cleanDate(dayDate);
      return new Date(avaDate).getTime() === new Date(dateToCompare).getTime();
    });
  }
  // este metodo crea un dia de availability sloths vacios, para un bussines, en la fecha indicada.
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
  // metodo limpia el formato de fecha
  cleanDate(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }
  // metodo crea una lista de fechas basado en hoy, los dias que le indiquemos adelante.
  createDayList(today: Date): Date[] {
    const dateList: Date[] = [];
    // esta es la cantidad de dias de agenda que creamos
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
  // metodo busca un availability con el ID, bussID y dayDate
  async findOne(term: string) {
    let ava: Availability | null = null;
    try {
      if (isValidObjectId(term)) {
        ava = await this.availabilityModel.findById(term);
      }
      if (!ava) {
        ava = await this.availabilityModel.findOne({ bussinessID: term });
      }
      if (!ava) {
        ava = await this.availabilityModel.findOne({ dayDate: term });
      }
      return ava;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Availability not found`);
    }
  }

  async findSlothByAppointmentId(id: string, slothId: string) {
    const ava = await this.findOne(id);
    const sloths = ava?.slots.filter((item) => item.reservationId === slothId);
    return sloths;
  }
  // necesito el avaID = id
  // bussId = app.busID
  // startTime = app.startTime
  // productID = app.productID

  async freeAvailabilitySpace(
    ava: Availability,
    appointment: Appointment,
    appId: string,
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const spacesToFree = await this.findSlothByAppointmentId(
        ava._id.toString(),
        appId,
      );
      const buss = await this.bussinessModel.findById(appointment.bussinessID);
      if (!buss)
        throw new NotFoundException(
          'Bussiness - Availability information not found',
        );
      spacesToFree?.forEach((item) => {
        const startTime = item.startTime;
        const bussTime = buss.defaultAppointmentTime;
        const slothTime = new Date(startTime.getTime() + bussTime * 60000);
        item.endTime = slothTime;
        item.isAvailable = true;
        item.reservationId = '';
      });
      ava.markModified('slots');
      await ava?.save({ session });
      await session.commitTransaction();
      return 'Appointment Space Free';
    } catch (error) {
      if (error instanceof Error) {
        if (error.name == 'BadRequestException') {
          throw new BadRequestException(error.message);
        }
        if (error.name == 'NotFoundException') {
          throw new NotFoundException(error.message);
        } else {
          throw new ConflictException(
            'Lo sentimos. El espacio no pudo ser liberado, contact admin',
          );
        }
      }
    } finally {
      await session.endSession();
    }
  }
  // metodo actualiza un espacio de agenda para cita
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
  // metodo elimina un espacio de availability.
  // todo necesito, posiblemente en appointmentModule, que al eliminar una cita, el espacio vuelva a estar disponible.
  async remove(id: string) {
    const { deletedCount } = await this.availabilityModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new NotFoundException(`Agenda space not found - ID: ${id}`);
    }
    return `Removed - true`;
  }
  // metodo selecciona el espacios availability y lo convierte en un appointment. Tomando los espacios necesarios de acuerdo al tiempo.
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
        if (error.name == 'BadRequestException') {
          console.log('Error fue badRequest');
          throw new BadRequestException(error.message);
        }
        if (error.name == 'NotFoundException') {
          console.log('Error fue notFound');
          throw new NotFoundException(error.message);
        } else {
          throw new ConflictException(
            'Lo sentimos. El espacio seleccionado ya fue ocupado',
          );
        }
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
        throw new BadRequestException(
          `Ventana de tiempo insuficente para el servicio seleccionado`,
        );
      }
      // esto nos debe dar NotFound, cuando el primer espacio no esta disponible
      if (!slot.isAvailable) {
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
  // con este metodo creo los sloths vacios basado en el horario del bussiness
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
