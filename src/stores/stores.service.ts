import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreEntity } from './entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private productRepository: Repository<StoreEntity>,
  ) {}
  create(createStoreDto: CreateStoreDto) {
    if (createStoreDto.city.length !== 3)
      throw new PreconditionFailedException(
        'La ciudad debe tener 3 caracteres',
      );
    return this.productRepository.save(createStoreDto);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const store = await this.productRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Tienda no encontrada');
    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.productRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Tienda no encontrada');
    if (updateStoreDto.city.length !== 3)
      throw new PreconditionFailedException(
        'La ciudad debe tener 3 caracteres',
      );
    return this.productRepository.save({ ...store, ...updateStoreDto });
  }

  async remove(id: string) {
    const store = await this.productRepository.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Tienda no encontrada');
    return this.productRepository.delete(id);
  }
}
