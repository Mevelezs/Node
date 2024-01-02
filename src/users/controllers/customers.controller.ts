import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CustomersService } from 'src/users/services/customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private customersServices: CustomersService) {}

  //--------Para los Nativos ------------
  @Get('/otra')
  getInfoDB() {
    return this.customersServices.getInfoDB();
  }

  @Get('/postgres')
  getInfDB2() {
    return this.customersServices.getInfDbPost();
  }
  //----------------------------------------

  @Get()
  findAll() {
    return this.customersServices.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.customersServices.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateCustomerDto) {
    return this.customersServices.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersServices.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersServices.remove(id);
  }
}
