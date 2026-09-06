import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Bussiness, BussinessDocument } from './entities/bussiness.entity';
import { CreateBussinessDto } from './dto/create-bussiness.dto';
import { UpdateBussinessDto } from './dto/update-bussiness.dto';

@Injectable()
export class BussinessService {
  constructor(
    @InjectModel(Bussiness.name)
    private readonly bussinessModel: Model<BussinessDocument>,
  ) {}
  create(createBussinessDto: CreateBussinessDto) {
    try {
      const bussiness = this.bussinessModel.create(createBussinessDto);
      return bussiness;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new BadRequestException(`Something wrong happend - Check logs`);
      }
    }
  }

  async findAll() {
    const bussi = await this.bussinessModel.find({});
    return bussi;
  }

  async findOne(term: string) {
    let bussiness: Bussiness | null = null;
    try {
      // buscar por ID
      if (isValidObjectId(term)) {
        bussiness = await this.bussinessModel.findById(term);
      }
      // buscar por nombre
      if (!bussiness) {
        bussiness = await this.bussinessModel.findOne({ name: term });
      }
      // buscar por descripcion
      if (!bussiness) {
        bussiness = await this.bussinessModel.findOne({ description: term });
      }
      return bussiness;
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException(
          `Not found a bussiness for term: ${term} error: ${error}`,
        );
      }
    }
  }

  async update(id: string, updateBussinessDto: UpdateBussinessDto) {
    try {
      const bussiness = await this.findOne(id);
      await bussiness?.updateOne(updateBussinessDto);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new BadRequestException(`Item could not be updated - Check logs`);
      }
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.bussinessModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Requested id: ${id} not found`);
    }
    return true;
  }

  async fillDBWithData(data: object[]) {
    await this.bussinessModel.insertMany(data);
  }

  async findProductByID(id: string, productId: string) {
    const buss = await this.findOne(id);
    const product = buss?.products.find(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      (item) => item._id!.toString() === productId,
    );
    return product;
  }
}
