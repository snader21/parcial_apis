import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity, ProductType } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  create(createProductDto: CreateProductDto) {
    if (
      createProductDto.type !== ProductType.PERECEDERO &&
      createProductDto.type !== ProductType.NO_PERECEDERO
    )
      throw new PreconditionFailedException(
        'El tipo de producto debe ser perecedero o no perecedero',
      );

    return this.productRepository.save(createProductDto);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (
      updateProductDto.type !== ProductType.PERECEDERO &&
      updateProductDto.type !== ProductType.NO_PERECEDERO
    )
      throw new PreconditionFailedException(
        'El tipo de producto debe ser perecedero o no perecedero',
      );
    return this.productRepository.save({ ...product, ...updateProductDto });
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return this.productRepository.delete(id);
  }
}
