import { PartialType } from '@nestjs/swagger';
import { IsArray, IsDate, IsMongoId, IsNotEmpty } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly customer: string;

  @IsDate()
  @IsNotEmpty()
  readonly date: Date;

  @IsArray()
  @IsNotEmpty()
  readonly products: Product[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
// OmitType(CreateOrderDto, ['products']), // para omitir el campo especificado en el update

export class AddProductsToOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly productsIds: string[];
}
