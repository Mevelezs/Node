import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';
import { CustomersController } from './controllers/customers.controller';

import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([User, Customer])],
  controllers: [UsersController, CustomersController],
  providers: [UsersService, CustomersService],
})
export class UsersModule {}
