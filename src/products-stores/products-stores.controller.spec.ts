import { Test, TestingModule } from '@nestjs/testing';
import { ProductsStoresController } from './products-stores.controller';
import { ProductsStoresService } from './products-stores.service';

describe('ProductsStoresController', () => {
  let controller: ProductsStoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsStoresController],
      providers: [ProductsStoresService],
    }).compile();

    controller = module.get<ProductsStoresController>(ProductsStoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
