import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Products } from 'src/products/entities/products.entity';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/orderItem.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.entity';
// import { ProductsService } from 'src/products/services/products.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    // private productService: ProductsService, // ojo con la inyección desde otro module ver apuntes.md => mas relaciones paso 6
    @InjectRepository(Products) private productRepo: Repository<Products>,
  ) {}

  findAll() {
    return this.orderItemRepo.find({ relations: ['products', 'order'] });
  }
  async create(data: CreateOrderItemDto) {
    const order = await this.orderRepo.findOneBy({ id: data.orderId });
    // const product = await this.productService.findOneById(data.productId);
    const product = await this.productRepo.findOneBy({ id: data.productId });

    if (!order || !product) throw new Error('Invalid data');

    const item = new OrderItem(); // forma manual (porque son pocos datos)
    item.order = order;
    item.products = product;
    item.quantity = data.quantity;

    return this.orderItemRepo.save(item);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const item = await this.orderItemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item Not found');
    return this.orderItemRepo.merge(item, changes);
  }

  async remove(id: number) {
    const item = await this.orderItemRepo.findOneBy({ id: id });
    if (!item) throw new NotFoundException('Item Not Found');
    return this.orderItemRepo.delete(id);
  }
}
