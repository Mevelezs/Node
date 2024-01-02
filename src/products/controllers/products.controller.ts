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

import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';

import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productService.findAll();
  }

  @Get(':productId')
  getById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.findOneById(productId);
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
