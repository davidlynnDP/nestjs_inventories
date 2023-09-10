import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,  
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

    private exceptionHandlingProducts( error: any ) {

      console.log( error )

      //*conditions - errorEnumeration


      this.logger.error( error )
      
      throw new InternalServerErrorException('Unexpected error, check the server logs!'); 
    }
  
    async deleteAllProducts() {
      const query = this.productRepository.createQueryBuilder('product');  
  
      try {
        return await query
          .delete()
          .where({})   
          .execute();
  
      } catch ( error ) {
        this.exceptionHandlingProducts( error );
      }
  
    }
}
