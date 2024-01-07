import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './controllers/customers.controller';
import { Customer } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';

import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';

import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/order.entity';
import { OrdersService } from './services/orders.service';

import { ProductsModule } from '../products/products.module';

import { OrderItemController } from './controllers/order-item.controller';
import { OrderItem } from './entities/orderItem.entity';
import { OrderItemService } from './services/order-item.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([User, Customer, OrderItem, Order]),
  ],
  controllers: [
    UsersController,
    CustomersController,
    OrdersController,
    OrderItemController,
  ],
  providers: [UsersService, CustomersService, OrdersService, OrderItemService],
  exports: [UsersService],
})
export class UsersModule {}
