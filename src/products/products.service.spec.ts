import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity, ProductType } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

let service: ProductsService;
let productRepository: Repository<ProductEntity>;
let productList: ProductEntity[];

const generateCreateProductDto = () => {
  return {
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    type: faker.helpers.arrayElement([
      ProductType.PERECEDERO,
      ProductType.NO_PERECEDERO,
    ]),
  };
};

const insertProductIntoDb = async (): Promise<ProductEntity> => {
  const productDto = generateCreateProductDto();
  return await productRepository.save(productDto);
};

const seedDatabase = async () => {
  productList = [];
  for (let i = 0; i < 5; i++) {
    const product = await insertProductIntoDb();
    productList.push(product);
  }
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [ProductsService],
  }).compile();

  service = module.get<ProductsService>(ProductsService);
  productRepository = module.get<Repository<ProductEntity>>(
    getRepositoryToken(ProductEntity),
  );
  await seedDatabase();
});

afterEach(async () => {
  await productRepository.clear();
});

describe('ProductsService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('findAll should return a list of products', async () => {
    const products = await service.findAll();
    expect(products).toHaveLength(productList.length);
  });

  it('findOne should return a product', async () => {
    const storedProduct = productList[0];
    const product = await service.findOne(storedProduct.id);
    expect(product).toBeDefined();
    expect(product.id).toEqual(storedProduct.id);
    expect(product.name).toEqual(storedProduct.name);
    expect(product.price).toEqual(storedProduct.price);
    expect(product.type).toEqual(storedProduct.type);
  });

  it('findOne should throw an exception if the product does not exist', async () => {
    await expect(service.findOne(faker.string.uuid())).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });

  it('create should create a new product', async () => {
    const productDto = generateCreateProductDto();
    const product = await service.create(productDto);
    expect(product).toBeDefined();
    expect(product.name).toEqual(productDto.name);
    expect(product.price).toEqual(productDto.price);
    expect(product.type).toEqual(productDto.type);

    const storedProduct = await productRepository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).toBeDefined();
    expect(storedProduct.name).toEqual(productDto.name);
    expect(storedProduct.price).toEqual(productDto.price);
    expect(storedProduct.type).toEqual(productDto.type);
  });

  it('create should throw an exception for invalid product type', () => {
    const productDto = {
      ...generateCreateProductDto(),
      type: 'InvalidType' as ProductType,
    };
    expect(() => service.create(productDto)).toThrow(
      'El tipo de producto debe ser perecedero o no perecedero',
    );
  });

  it('update should modify an existing product', async () => {
    const storedProduct = productList[0];
    const updateProductDto = generateCreateProductDto();
    const updatedProduct = await service.update(
      storedProduct.id,
      updateProductDto,
    );
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toEqual(updateProductDto.name);
    expect(updatedProduct.price).toEqual(updateProductDto.price);
    expect(updatedProduct.type).toEqual(updateProductDto.type);

    const storedUpdatedProduct = await productRepository.findOne({
      where: { id: storedProduct.id },
    });
    expect(storedUpdatedProduct).toBeDefined();
    expect(storedUpdatedProduct.name).toEqual(updateProductDto.name);
    expect(storedUpdatedProduct.price).toEqual(updateProductDto.price);
    expect(storedUpdatedProduct.type).toEqual(updateProductDto.type);
  });

  it('update should throw an exception if the product does not exist', async () => {
    const updateProductDto = generateCreateProductDto();
    await expect(
      service.update(faker.string.uuid(), updateProductDto),
    ).rejects.toHaveProperty('message', 'Producto no encontrado');
  });

  it('update should throw an exception for invalid product type', async () => {
    const storedProduct = productList[0];
    const updateProductDto = {
      ...generateCreateProductDto(),
      type: 'InvalidType' as ProductType,
    };
    await expect(
      service.update(storedProduct.id, updateProductDto),
    ).rejects.toHaveProperty(
      'message',
      'El tipo de producto debe ser perecedero o no perecedero',
    );
  });

  it('remove should delete an existing product', async () => {
    const storedProduct = productList[0];
    await service.remove(storedProduct.id);
    const deletedProduct = await productRepository.findOne({
      where: { id: storedProduct.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('remove should throw an exception if the product does not exist', async () => {
    await expect(service.remove(faker.string.uuid())).rejects.toHaveProperty(
      'message',
      'Producto no encontrado',
    );
  });
});
