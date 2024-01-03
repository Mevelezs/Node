import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/categories.dto';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOneById(id);
  }

  @Post()
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoryService.create(payload);
  }

  @Put(':id')
  updateCategory(@Param('id') id: number, @Body() payload: UpdateCategoryDto) {
    return this.categoryService.update(id, payload);
  }

  @Delete(':id')
  removeCategory(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
