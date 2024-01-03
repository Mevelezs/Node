import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';

import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get()
  getAllProducts(@Query() params: FilterProductDto) {
    return this.productService.findAll(params);
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

  @Put(':id/category/:categoryId')
  addCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productService.addCategoryToProduct(id, categoryId);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }

  @Delete(':id/category/:categoryId')
  deleteCategoryToProduct(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productService.deleteCategoryToProduct(id, categoryId);
  }
}
