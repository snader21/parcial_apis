import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  name: string;
  price: number;
  type: ProductType;
}
