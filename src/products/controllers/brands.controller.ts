import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { BrandsService } from '../services/brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private brandService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.brandService.findOne(id);
  }

  @Post()
  createBrand(@Body() payload: CreateBrandDto) {
    return this.brandService.create(payload)
  }

  @Put(':id')
  updateBrand(@Param('id') id: number, @Body() payload: UpdateBrandDto) {
    return this.brandService.update(id, payload);
  }

  @Delete(':id')
  deleteBrand(@Param('id') id: number) {
     return this.brandService.delete(id);
   }
}
