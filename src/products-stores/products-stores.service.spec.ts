import { Test, TestingModule } from '@nestjs/testing';
import { ProductsStoresService } from './products-stores.service';

describe('ProductsStoresService', () => {
  let service: ProductsStoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsStoresService],
    }).compile();

    service = module.get<ProductsStoresService>(ProductsStoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
