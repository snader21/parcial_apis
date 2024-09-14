import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from './entities/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

let service: StoresService;
let storeRepository: Repository<StoreEntity>;
let storeList: StoreEntity[];

const generateCreateStoreDto = () => {
  return {
    name: faker.company.name(),
    city: faker.string.alpha({ length: 3 }),
    address: faker.location.streetAddress(),
  };
};

const insertStoreIntoDb = async (): Promise<StoreEntity> => {
  const storeDto = generateCreateStoreDto();
  return await storeRepository.save(storeDto);
};

const seedDatabase = async () => {
  storeList = [];
  for (let i = 0; i < 5; i++) {
    const store = await insertStoreIntoDb();
    storeList.push(store);
  }
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [...TypeOrmTestingConfig()],
    providers: [StoresService],
  }).compile();

  service = module.get<StoresService>(StoresService);
  storeRepository = module.get<Repository<StoreEntity>>(
    getRepositoryToken(StoreEntity),
  );
  await seedDatabase();
});

afterEach(async () => {
  await storeRepository.clear();
});

describe('StoresService', () => {
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(storeRepository).toBeDefined();
  });

  it('findAll should return a list of stores', async () => {
    const stores = await service.findAll();
    expect(stores).toHaveLength(storeList.length);
  });

  it('findOne should return a store', async () => {
    const storedStore = storeList[0];
    const store = await service.findOne(storedStore.id);
    expect(store).toBeDefined();
    expect(store.id).toEqual(storedStore.id);
    expect(store.name).toEqual(storedStore.name);
    expect(store.city).toEqual(storedStore.city);
    expect(store.address).toEqual(storedStore.address);
  });

  it('findOne should throw an exception if the store does not exist', async () => {
    await expect(service.findOne(faker.string.uuid())).rejects.toHaveProperty(
      'message',
      'Tienda no encontrada',
    );
  });

  it('create should create a new store', async () => {
    const storeDto = generateCreateStoreDto();
    const store = await service.create(storeDto);
    expect(store).toBeDefined();
    expect(store.name).toEqual(storeDto.name);
    expect(store.city).toEqual(storeDto.city);
    expect(store.address).toEqual(storeDto.address);

    const storedStore = await storeRepository.findOne({
      where: { id: store.id },
    });
    expect(storedStore).toBeDefined();
    expect(storedStore.name).toEqual(storeDto.name);
    expect(storedStore.city).toEqual(storeDto.city);
    expect(storedStore.address).toEqual(storeDto.address);
  });

  it('create should throw an exception for invalid city length', () => {
    const storeDto = {
      ...generateCreateStoreDto(),
      city: 'ABCD',
    };
    expect(() => service.create(storeDto)).toThrow(
      'La ciudad debe tener 3 caracteres',
    );
  });

  it('update should modify an existing store', async () => {
    const storedStore = storeList[0];
    const updateStoreDto = generateCreateStoreDto();
    const updatedStore = await service.update(storedStore.id, updateStoreDto);
    expect(updatedStore).toBeDefined();
    expect(updatedStore.name).toEqual(updateStoreDto.name);
    expect(updatedStore.city).toEqual(updateStoreDto.city);
    expect(updatedStore.address).toEqual(updateStoreDto.address);

    const storedUpdatedStore = await storeRepository.findOne({
      where: { id: storedStore.id },
    });
    expect(storedUpdatedStore).toBeDefined();
    expect(storedUpdatedStore.name).toEqual(updateStoreDto.name);
    expect(storedUpdatedStore.city).toEqual(updateStoreDto.city);
    expect(storedUpdatedStore.address).toEqual(updateStoreDto.address);
  });

  it('update should throw an exception if the store does not exist', async () => {
    const updateStoreDto = generateCreateStoreDto();
    await expect(
      service.update(faker.string.uuid(), updateStoreDto),
    ).rejects.toHaveProperty('message', 'Tienda no encontrada');
  });

  it('update should throw an exception for invalid city length', async () => {
    const storedStore = storeList[0];
    const updateStoreDto = {
      ...generateCreateStoreDto(),
      city: 'ABCD',
    };
    await expect(
      service.update(storedStore.id, updateStoreDto),
    ).rejects.toHaveProperty('message', 'La ciudad debe tener 3 caracteres');
  });

  it('remove should delete an existing store', async () => {
    const storedStore = storeList[0];
    await service.remove(storedStore.id);
    const deletedStore = await storeRepository.findOne({
      where: { id: storedStore.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('remove should throw an exception if the store does not exist', async () => {
    await expect(service.remove(faker.string.uuid())).rejects.toHaveProperty(
      'message',
      'Tienda no encontrada',
    );
  });
});
