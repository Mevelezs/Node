import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { Brands } from '../entities/brands.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brands) private repoBrands: Repository<Brands>,
  ) {}

  findAll() {
    return this.repoBrands.find();
  }

  async findOne(id: number) {
    const brand = await this.repoBrands.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!brand) throw new NotFoundException('Marca no encontrada');
    return brand;
  }

  create(data: CreateBrandDto) {
    const newBrand = this.repoBrands.create(data);
    this.repoBrands.save(newBrand);

    return newBrand;
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    this.repoBrands.merge(brand, changes);

    return this.repoBrands.save(brand);
  }

  async delete(id: number) {
    const brand = await this.findOne(id);
    return this.repoBrands.remove(brand);
  }
}
