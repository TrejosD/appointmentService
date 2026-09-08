import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AvailabilityService } from 'src/availability/availability.service';
import { BussinessService } from 'src/bussiness/bussiness.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly bussinessService: BussinessService,
    private readonly availabilityService: AvailabilityService,
  ) {}
  // el logger nativo de NEST rastrear la ejecucion.
  private readonly logger = new Logger(TasksService.name);
  findAll() {
    return `This action returns all tasks`;
  }

  @Cron('0 0 * * *')
  async createAgendaSpaces() {
    this.logger.log('Iniciando tareas automaticas CREATE_AGENDA_NEW_DAYS');
    try {
      await this.createNewAgendas();
      this.logger.log('Success - Espacios creados correctamente');
    } catch (error) {
      this.logger.log(error);
    }
  }
  // este metodo busca todos los bussiness y crea una agenda diaria, por 14 dias, de espacios vacios de acuerdo a su schedule.
  // todo este metodo, debe de llamarse cada que se crea un bussiness nuevo
  // todo, este metodo crear las agendas de todos los bussiness, necesito, otro especifico, para un solo bussiness. Y llamar ese al crear el bussines.
  // argumento buss.id, y llama al populateEmptyAgengas(buss.id) una vez.
  async createNewAgendas() {
    const bussinesses = await this.bussinessService.findAll();
    if (bussinesses == null) {
      this.logger.log('Bussiness No encontrados');
    }
    bussinesses.forEach((buss) =>
      this.availabilityService.populateEmptyAgendas(buss.id),
    );
  }
}
