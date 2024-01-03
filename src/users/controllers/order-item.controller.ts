import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateOrderItemDto } from '../dtos/orderItem.dto';
import { OrderItemService } from '../services/order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItem: OrderItemService) {}

  @Get()
  findAll() {
    return this.orderItem.findAll();
  }

  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this.orderItem.create(payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItem.remove(id);
  }
}
