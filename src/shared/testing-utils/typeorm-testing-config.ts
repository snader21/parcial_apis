/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../products/entities/product.entity';
import { StoreEntity } from '../../stores/entities/store.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    // logging: ['query', 'error'],
    entities: [ProductEntity, StoreEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductEntity, StoreEntity]),
];
