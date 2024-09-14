import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ProductsStoresService } from './products-stores.service';

@Controller('products')
export class ProductsStoresController {
  constructor(private readonly productsStoresService: ProductsStoresService) {}

  @Post(':productId/stores/:storeId')
  addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productsStoresService.addStoreToProduct(productId, storeId);
  }

  @Get(':productId/stores')
  findStoresFromProduct(@Param('productId') productId: string) {
    return this.productsStoresService.findStoresFromProduct(productId);
  }

  @Get(':productId/stores/:storeId')
  findStoreFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productsStoresService.findStoreFromProduct(productId, storeId);
  }

  @Put(':productId/stores')
  updateStoresFromProduct(
    @Param('productId') productId: string,
    @Body('storesId') storesId: string[],
  ) {
    return this.productsStoresService.updateStoresFromProduct(
      productId,
      storesId,
    );
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  deleteStoresFromProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.productsStoresService.deleteStoresFromProduct(
      productId,
      storeId,
    );
  }
}
