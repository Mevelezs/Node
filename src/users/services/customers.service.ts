import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'pg';
import { Repository } from 'typeorm';

import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from 'src/users/dtos/customer.dto';
import { Customer } from 'src/users/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    //----Nativos-----------
    @Inject('CONNECT_DB') private connectDB: Client,
    @Inject('POSTGRES_CONNECT') private connectPosrgres: Client,
    //-----------------------
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}
  //  --------------- Nativos ------------------
  getInfoDB() {
    return new Promise((resolve, reject) => {
      this.connectDB.query('SELECT * FROM user', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }

  getInfDbPost() {
    return new Promise((resolve, reject) => {
      this.connectPosrgres.query('SELECT * FROM user', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }
  // ---------------------------------

  findAll() {
    return this.customerRepo.find();
  }

  async findOne(id: number) {
    const user = await this.customerRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(data: CreateCustomerDto) {
    const newUser = this.customerRepo.create(data);
    return this.customerRepo.save(newUser);
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const userUpdated = await this.findOne(id);
    this.customerRepo.merge(userUpdated, changes);

    return this.customerRepo.save(userUpdated);
  }

  async remove(id: number) {
    const deleteUser = await this.findOne(id);
    return this.customerRepo.remove(deleteUser);
  }
}
