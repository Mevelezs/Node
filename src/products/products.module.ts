import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Products } from './entities/products.entity';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';

import { Brands } from './entities/brands.entity';
import { BrandsService } from './services/brands.service';
import { BrandsController } from './controllers/brands.controller';

import { Category } from './entities/categories.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category, Brands])],
  controllers: [ProductsController, CategoriesController, BrandsController],
  providers: [ProductsService, CategoriesService, BrandsService],
  exports: [ProductsService],
})
export class ProductsModule {}
