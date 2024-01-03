import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private customerService: CustomersService,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['customer'] });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);

    if (data.customerId) {
      const customer = await this.customerService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const userUpdated = await this.findOne(id);
    this.userRepo.merge(userUpdated, changes);
    return this.userRepo.save(userUpdated);
  }

  async remove(id: number) {
    const deleteUser = await this.findOne(id);
    return this.userRepo.remove(deleteUser);
  }
}
