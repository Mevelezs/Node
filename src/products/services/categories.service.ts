import { Injectable } from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';

@Injectable()
export class CategoriesService {
  findAll() {
    return;
  }

  findOne(id: number) {
    return;
  }

  create(data: CreateCategoryDto) {
    return;
  }

  update(id: number, changes: UpdateCategoryDto) {
    return;
  }

  remove(id: number) {
    return true;
  }
}
