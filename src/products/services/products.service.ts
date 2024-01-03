import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';

import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from 'src/products/dtos/product.dto';

import { Category } from '../entities/categories.entity';
import { Products } from '../entities/products.entity';

import { Brands } from '../entities/brands.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brands) private brandRepo: Repository<Brands>,
  ) {}

  findAll(params?: FilterProductDto) {
    if (params) {
      const where: FindOptionsWhere<Products> = {};
      const { limit, offset, maxPrice, minPrice } = params;

      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }

      return this.productRepo.find({
        where,
        take: limit,
        skip: offset,
        relations: ['brand'],
      });
    }

    return this.productRepo.find({ relations: ['bran'] });
  }

  async findOneById(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'category'],
    });
    if (!product) {
      throw new NotFoundException('El producto no está');
    }
    return product;
  }

  async findbyName(name: string) {
    const product = await this.productRepo.findOne({
      where: { name },
    });
    return product;
  }

  async create(data: CreateProductDto) {
    const product = await this.findbyName(data.name);
    if (product) throw new NotFoundException('El producto ya existe');
    // crea y valida la instancia con el dto
    const newProduct = this.productRepo.create(data);

    //-----------------------------------------
    // estas son obligatorias; solo se validan para los tests
    if (data.brandId) {
      const brand = await this.brandRepo.findOne({
        where: { id: data.brandId },
      });
      newProduct.brand = brand;
    }
    if (data.categoriesIds) {
      const category = await this.categoryRepo.findBy({
        id: In(data.categoriesIds),
      });
      newProduct.category = category;
    }
    //---------------------------------------
    return this.productRepo.save(newProduct); // guarda la instancia en la db
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.findOneById(id);

    if (changes.brandId) {
      const brand = await this.brandRepo.findOneBy({ id: changes.brandId });
      product.brand = brand;
    }
    this.productRepo.merge(product, changes); // actualiza los campos que se le pasan por parametro
    return this.productRepo.save(product);
  }

  async delete(id: number) {
    const product = await this.findOneById(id);
    return this.productRepo.remove(product);
  }

  async deleteCategoryToProduct(id: number, categoryId: number) {
    const product = await this.findOneById(id);
    product.category = product.category.filter((cat) => cat.id !== categoryId);

    return this.productRepo.save(product);
  }

  async addCategoryToProduct(id: number, categoryId: number) {
    const product = await this.findOneById(id);

    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException('La categoría no existe');
    }

    product.category.map((cat) => {
      if (cat.id === categoryId)
        throw new NotFoundException('La categoria ya está');
    });

    product.category.push(category);
    return this.productRepo.save(product);
  }
}
