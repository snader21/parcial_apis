import { StoreEntity } from '../../stores/entities/store.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProductType {
  PERECEDERO = 'Perecedero',
  NO_PERECEDERO = 'No perecedero',
}

@Entity('products ')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  type: ProductType;

  @ManyToMany(() => StoreEntity, (store) => store.products)
  @JoinTable({
    name: 'products_stores',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'storeId',
      referencedColumnName: 'id',
    },
  })
  stores: StoreEntity[];
}
