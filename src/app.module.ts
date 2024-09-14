import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { ProductsStoresModule } from './products-stores/products-stores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/entities/product.entity';
import { StoreEntity } from './stores/entities/store.entity';

@Module({
  imports: [
    ProductsModule,
    StoresModule,
    ProductsStoresModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [ProductEntity, StoreEntity],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
