import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../stores/entities/store.entity';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class ProductsStoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async addStoreToProduct(productId: string, storeId: string) {
    console.log(storeId, productId);
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException('Tienda no encontrada');
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    product.stores = [...product.stores, store];
    return this.productRepository.save(product);
  }

  async findStoresFromProduct(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product.stores;
  }

  async findStoreFromProduct(productId: string, storeId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'],
    });
    if (!store) throw new NotFoundException('Tienda no encontrada');

    const productStore = store.products.find(
      (product) => product.id === productId,
    );
    if (!productStore)
      throw new NotFoundException('La tienda no está asociada al producto');
    return productStore;
  }

  async updateStoresFromProduct(
    productId: string,
    storeIds: string[],
  ): Promise<ProductEntity> {
    const prodcut = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['stores'],
    });
    if (!prodcut) {
      throw new NotFoundException(
        `El producto con ID ${productId} no fue encontrado.`,
      );
    }
    const stores = await this.storeRepository.find({
      where: {
        id: In(storeIds),
      },
    });
    if (stores.length !== storeIds.length) {
      throw new NotFoundException('Una o más tiendas no fueron encontrados.');
    }
    prodcut.stores = stores;
    return await this.productRepository.save(prodcut);
  }

  async deleteStoresFromProduct(productId: string, storeId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['products'],
    });
    if (!store) throw new NotFoundException('Tienda no encontrada');

    const productStore = store.products.find(
      (product) => product.id === productId,
    );
    if (!productStore)
      throw new NotFoundException('La tienda no está asociada al producto');
    store.products = store.products.filter(
      (product) => product.id !== productId,
    );
    return this.storeRepository.save(store);
  }
}
