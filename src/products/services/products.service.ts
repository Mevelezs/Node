import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';

import { Products } from '../entities/products.entity';
import { BrandsService } from './brands.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
    private brandService : BrandsService,
  ) {}

  findAll() {
    return this.productRepo.find({ relations: ['brand']});
  }

  async findOneById(id: number) {
    const product = await this.productRepo.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException('El producto no está');
    }
    return product;
  }

 async create(data: CreateProductDto) {
    const newProduct = this.productRepo.create(data); // crea y valida la instancia con el dto
    if (data.brandId) {
      const brand = await this.brandService.findOne(data.brandId)
      newProduct.brand = brand
    }
    return this.productRepo.save(newProduct); // guarda la instancia en la db
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.findOneById(id);

    if (changes.brandId) {
      const brand = await this.brandService.findOne(changes.brandId)
      product.brand = brand
    }
    this.productRepo.merge(product, changes); // actualiza los campos que se le pasan por parametro
    return this.productRepo.save(product);
  }

  async delete(id: number) {
    const product = await this.findOneById(id);
    return this.productRepo.remove(product);
  }
}
