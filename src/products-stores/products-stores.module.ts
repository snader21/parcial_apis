import { Module } from '@nestjs/common';
import { ProductsStoresService } from './products-stores.service';
import { ProductsStoresController } from './products-stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../products/entities/product.entity';
import { StoreEntity } from '../stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
  controllers: [ProductsStoresController],
  providers: [ProductsStoresService],
})
export class ProductsStoresModule {}
