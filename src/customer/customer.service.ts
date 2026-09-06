import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './entities/customer.entity';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}
  create(createCustomerDto: CreateCustomerDto) {
    return this.customerModel.create(createCustomerDto);
  }

  async findAll() {
    return await this.customerModel.find({});
  }

  async findOne(id: string) {
    try {
      const customer = await this.customerModel.findById(id);
      return customer;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Customer not found');
    }
  }
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    await customer!.updateOne(updateCustomerDto);
    return customer;
  }

  async remove(id: string) {
    const { deletedCount } = await this.customerModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Customer could not be removed id: ${id}`);
    }
    return 'Removed';
  }
}
