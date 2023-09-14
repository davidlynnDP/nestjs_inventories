import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate as isUUID } from 'uuid'; 

import { ProductCategories } from "./entities";
import { CommonService } from "src/common/common.service";
import { PaginationDto } from "src/common/dtos";


@Injectable()
export class ProductCategoriesService {

    constructor(
        @InjectRepository(ProductCategories)
        private readonly productCategoryRepository: Repository<ProductCategories>,  
        
        private readonly commonService: CommonService,
      ) {}


      async createProductCategory( category: string ): Promise<ProductCategories> {

        let isCategoryFound: ProductCategories = await this.findTheCategory( category );
    
        if ( !!isCategoryFound ) return isCategoryFound;
    
        try {
    
          const categoryInstance = this.productCategoryRepository.create({
            category
          });
          
          await this.productCategoryRepository.save( categoryInstance );  
    
          return categoryInstance;
          
        } catch ( error ) {
          this.commonService.errorHandler( error );
        }
      }
    
      async findTheCategory( term: string ): Promise<ProductCategories> {
    
        let category: ProductCategories;

        if ( isUUID( term ) ) {
          category = await this.productCategoryRepository.findOneBy({ id: term });
        } else {
          category = await this.productCategoryRepository.findOneBy({ category: term })
        }
        
        if ( !category ) 
          throw new NotFoundException(`Category with the term ${ term } not found`); 
    
        return category;
      }
    
      async findAllCategories( paginationDto: PaginationDto ) {
    
        const { limit = 10, offset = 0 } = paginationDto;
    
        const categories = await this.productCategoryRepository.find({
          take: limit,   
          skip: offset, 
          relations: {
            products: true
          }
        })
    
        return categories.map( ({ category, products }) => ({
          category,
          products: products.map( product => product.title )
        }))
      }


      async deleteAllCategories() {
        const query = this.productCategoryRepository.createQueryBuilder('productCategory'); 
  
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