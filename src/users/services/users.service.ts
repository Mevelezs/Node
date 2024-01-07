import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Db } from 'mongodb';
import { Model } from 'mongoose';

import { ProductsService } from '../../products/services/products.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    @Inject('MONGO') private databaseMongo: Db,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  findAll() {
    return this.userModel.find().exec();
  }

  getTasks() {
    const tasksCollection = this.databaseMongo.collection('tasks');
    return tasksCollection.find().toArray();
  }

  async findOne(id: string) {
    return this.userModel.findById(id);
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    console.log(user);

    return user;
  }

  async getOrdersByUser(userId: string) {
    const user = await this.findOne(userId);
    return {
      date: new Date(),
      user,
      // products: this.productsService.findAll(),
      products: [],
    };
  }

  async createUser(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    const hashPasssword = await bcrypt.hash(data.password, 10);
    newModel.password = hashPasssword;
    newModel.save();

    return newModel;
  }

  update(id: string, changes: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
