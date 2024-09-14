import { Test, TestingModule } from '@nestjs/testing';
import { ProductsStoresService } from './products-stores.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProductEntity,
  ProductType,
} from '../products/entities/product.entity';
import { StoreEntity } from '../stores/entities/store.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

let service: ProductsStoresService;
let productRepository: Repository<ProductEntity>;
let storeRepository: Repository<StoreEntity>;
let productList: ProductEntity[];
let storeList: StoreEntity[];

const generateProductEntity = (): ProductEntity => {
  const product = new ProductEntity();
  product.id = faker.string.uuid();
  product.name = faker.commerce.productName();
  product.price = parseFloat(faker.commerce.price());
  product.type = faker.helpers.arrayElement([
    ProductType.PERECEDERO,
    ProductType.NO_PERECEDERO,
  ]);
  product.stores = [];
  return product;
};

const generateStoreEntity = (): StoreEntity => {
  const store = new StoreEntity();
  store.id = faker.string.uuid();
  store.name = faker.company.name();
  store.city = faker.string.alpha({ length: 3 });
  store.address = faker.location.streetAddress();
  store.products = [];
  return store;
};

const seedDatabase = async () => {
  productList = [];
  storeList = [];

  for (let i = 0; i < 5; i++) {
    const product = await productRepository.save(generateProductEntity());
    const store = await storeRepository.save(generateStoreEntity());
    productList.push(product);
    storeList.push(store);
  }
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [ProductsStoresService, ProductEntity, StoreEntity],
  }).compile();

  service = module.get<ProductsStoresService>(ProductsStoresService);
  productRepository = module.get<Repository<ProductEntity>>(
    getRepositoryToken(ProductEntity),
  );
  storeRepository = module.get<Repository<StoreEntity>>(
    getRepositoryToken(StoreEntity),
  );

  await seedDatabase();
});

afterEach(async () => {
  await productRepository.clear();
  await storeRepository.clear();
});

describe('ProductsStoresService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(storeRepository).toBeDefined();
  });

  it('addStoreToProduct should add a store to a product', async () => {
    const product = productList[0];
    const store = storeList[0];

    const result = await service.addStoreToProduct(product.id, store.id);
    expect(result).toBeDefined();
    expect(result.stores).toContainEqual(
      expect.objectContaining({
        id: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
      }),
    );
  });

  it('addStoreToProduct should throw an exception if the store is not found', async () => {
    const product = productList[0];
    await expect(
      service.addStoreToProduct(product.id, faker.string.uuid()),
    ).rejects.toHaveProperty('message', 'Tienda no encontrada');
  });

  it('addStoreToProduct should throw an exception if the product is not found', async () => {
    const store = storeList[0];
    await expect(
      service.addStoreToProduct(faker.string.uuid(), store.id),
    ).rejects.toHaveProperty('message', 'Producto no encontrado');
  });

  it('findStoresFromProduct should return stores associated with a product', async () => {
    const product = productList[0];
    const store = storeList[0];

    await service.addStoreToProduct(product.id, store.id);

    const stores = await service.findStoresFromProduct(product.id);
    expect(stores).toBeDefined();
    expect(stores).toContainEqual(
      expect.objectContaining({
        id: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
      }),
    );
  });

  it('updateStoresFromProduct should throw an exception if the product is not found', async () => {
    const storeIds = storeList.map((store) => store.id);
    const fakeProductId = faker.string.uuid();
    await expect(
      service.updateStoresFromProduct(fakeProductId, storeIds),
    ).rejects.toHaveProperty(
      'message',
      `El producto con ID ${fakeProductId} no fue encontrado.`,
    );
  });

  it('updateStoresFromProduct should throw an exception if one or more stores are not found', async () => {
    const product = productList[0];
    const invalidStoreId = faker.string.uuid();
    const storeIds = [...storeList.map((store) => store.id), invalidStoreId];
    await expect(
      service.updateStoresFromProduct(product.id, storeIds),
    ).rejects.toHaveProperty(
      'message',
      'Una o más tiendas no fueron encontrados.',
    );
  });

  it('deleteStoresFromProduct should remove a store association from a product', async () => {
    const product = productList[0];
    const store = storeList[0];

    await service.addStoreToProduct(product.id, store.id);

    const result = await service.deleteStoresFromProduct(product.id, store.id);
    expect(result).toBeDefined();
    const storesAfterDeletion = await service.findStoresFromProduct(product.id);
    expect(storesAfterDeletion).not.toContainEqual(store);
  });

  it('deleteStoresFromProduct should throw an exception if the product is not found', async () => {
    const store = storeList[0];
    await expect(
      service.deleteStoresFromProduct(faker.string.uuid(), store.id),
    ).rejects.toHaveProperty('message', 'Producto no encontrado');
  });

  it('deleteStoresFromProduct should throw an exception if the store is not found', async () => {
    const product = productList[0];
    await expect(
      service.deleteStoresFromProduct(product.id, faker.string.uuid()),
    ).rejects.toHaveProperty('message', 'Tienda no encontrada');
  });

  it('deleteStoresFromProduct should throw an exception if the store is not associated with the product', async () => {
    const product = productList[0];
    const store = storeList[0];
    await expect(
      service.deleteStoresFromProduct(product.id, store.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda no está asociada al producto',
    );
  });
});
