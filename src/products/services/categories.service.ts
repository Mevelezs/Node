import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { Category } from '../entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepo.find();
  }

  async findOneById(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findbyName(name: string) {
    const product = await this.categoryRepo.findOne({
      where: { name },
    });
    return product;
  }

  async create(data: CreateCategoryDto) {
    const category = await this.findbyName(data.name);
    if (category) throw new NotFoundException('La categoría ya existe');

    const newCat = this.categoryRepo.create(data);
    this.categoryRepo.save(newCat);

    return newCat;
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.findOneById(id);
    this.categoryRepo.merge(category, changes);

    return this.categoryRepo.save(category);
  }

  async delete(id: number) {
    const category = await this.findOneById(id);
    return this.categoryRepo.remove(category);
  }
}
