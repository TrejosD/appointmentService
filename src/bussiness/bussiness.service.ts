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
import { Follower, FollowerDocument } from './entities/follower.entity';

@Injectable()
export class BussinessService {
  constructor(
    @InjectModel(Bussiness.name)
    private readonly bussinessModel: Model<BussinessDocument>,
    @InjectModel(Follower.name)
    private readonly followerModel: Model<FollowerDocument>,
  ) {}
  // crea un bussiness nuevo
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
  // encuentra y retorna todos los bussiness
  async findAll() {
    const bussi = await this.bussinessModel.find({});
    return bussi;
  }

  // encuentra un bussiness de acuerdo al ID o nombre o description
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
  // motodo para editar un bussiness
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

  // metodo para eliminar un bussiness
  // todo deberia poder desabilitar un bussiness tambien
  async remove(id: string) {
    const { deletedCount } = await this.bussinessModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Requested id: ${id} not found`);
    }
    return true;
  }
  // metodo para SEED llenar el DB
  async fillDBWithData(data: object[]) {
    await this.bussinessModel.insertMany(data);
  }

  // buscar un producto en un bussiness
  async findProductByID(id: string, productId: string) {
    const buss = await this.findOne(id);
    const product = buss?.products.find(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      (item) => item._id!.toString() === productId,
    );
    return product;
  }

  async addNewFollower(userId: string, bussId: string) {
    // todo, el documento ya deberia estar creado, solo necesito agregar un nuevo follower, listo
    const follower = await this.followerModel.findById({ bussinessId: bussId });
    if (!follower) {
      const newFollow = await this.followerModel.create({
        bussinessId: bussId,
        userFollower: [userId],
      });
      return newFollow;
    }
    follower.userFollower = [...follower.userFollower, userId];
    await follower.save();
    return `Followers Updated ${userId}`;
  }
}
