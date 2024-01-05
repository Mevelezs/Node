import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerController } from '../products/services/controllers/customers.controller';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { CustomersService } from './services/customers.service';

import { UsersController } from '../products/services/controllers/users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './services/users.service';

import { OrdersController } from './controller/orders.controller';
import { Order, OrderSchema } from './entities/order.entity';
import { OrdersService } from './services/orders.service';

import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [CustomerController, UsersController, OrdersController],
  providers: [CustomersService, UsersService, OrdersService],
})
export class UsersModule {}
