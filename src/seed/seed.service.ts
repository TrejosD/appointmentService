import { Injectable } from '@nestjs/common';
import { BUSSINESS_SEED } from './data/bussines.seed';
import { BussinessService } from '../bussiness/bussiness.service';

@Injectable()
export class SeedService {
  constructor(private readonly bussinessService: BussinessService) {}
  async executeSeed() {
    await this.bussinessService.fillDBWithData(BUSSINESS_SEED);
    return `SEED executed`;
  }
}
