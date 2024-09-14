import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsStoreDto } from './create-products-store.dto';

export class UpdateProductsStoreDto extends PartialType(CreateProductsStoreDto) {}
