import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';
import { ProductImagesService } from './product-images.service';
import { ProductCategoriesService } from './product-categories.service';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 

    private readonly productImagesService: ProductImagesService, 

    private readonly productCategoriesService: ProductCategoriesService, 

    private readonly commonService: CommonService,
  ) {}


  async createProduct( createProductDto: CreateProductDto ) {
    
    const { category, ...productDetails } = createProductDto;
    const categoryInstance = await this.productCategoriesService.createProductCategory( category );

    try {
      
      const product = this.productRepository.create({ 
        ...productDetails,
        category: categoryInstance,
      });
      
      await this.productRepository.save( product );  

      return { ...product, category };
      
    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findProductByTerm( term: string ): Promise<Product> {

    let product: Product;

    if ( isUUID( term ) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product'); 
      product = await queryBuilder
        .where('UPPER(title) =:title or code =:code', {   
          title: term.toUpperCase(),
          code:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !product ) 
      throw new NotFoundException(`Product with the term ${ term } not found`); 

    return product;
  }

  async findProductByTermPlained( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...productPlained } = product;

    return {
      ...productPlained,
      images: images.map( image => image.url ),
      category: category.category
    }
  }

  async findAllProducts( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,   
      skip: offset,  
      relations: {
        images: true,    
        category: true
      }
    })

    return products.map( ( product ) => ({
      ...product,
      images: product.images.map( img => img.url ),
      category: product.category.category
    }))
  }


  async updateProduct( id: string, updateProductDto: UpdateProductDto ) {

    const { category, ...productToUpdate } = updateProductDto;
    
    await this.findProductByTerm( id );
    const categoryInstance = await this.productCategoriesService.createProductCategory( category );

    try {
      const product = await this.productRepository.preload({ 
        id, 
        ...productToUpdate, 
        category: categoryInstance 
      });

      await this.productRepository.save( product );  

      return { ...product, category };

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }

  async deleteProduct( id: string ) {

    const product = await this.findProductByTerm( id ); 

    try {
      await this.productRepository.remove( product );

      return `Successful product removal`;
      
    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
    
  }


    async deleteAllProducts() {
      const query = this.productRepository.createQueryBuilder('product'); 

      try {
        return await query
          .delete()
          .where({})  
          .execute();
  
      } catch ( error ) {
        this.commonService.errorHandler( error )
      }
  
    }
}
