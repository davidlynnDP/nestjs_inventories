import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate as isUUID } from 'uuid'; 

import { ProductCategories } from "./entities";
import { CommonService } from "src/common/common.service";
import { PaginationDto } from "src/common/dtos";
import { CompanyService } from "src/company/company.service";


@Injectable()
export class ProductCategoriesService {

    constructor(
        @InjectRepository(ProductCategories)
        private readonly productCategoryRepository: Repository<ProductCategories>,  

        private readonly companyService: CompanyService,
        
        private readonly commonService: CommonService,
      ) {}


      async createProductCategory( id: string, category: string ): Promise<ProductCategories> {

        let isCategoryFound: ProductCategories = await this.findTheCategory( category );
    
        if ( !!isCategoryFound ) return isCategoryFound;

        const company = await this.companyService.findCompanyByTerm( id )
    
        try {
    
          const categoryInstance = this.productCategoryRepository.create({
            category,
            company
          });
          
          return await this.productCategoryRepository.save( categoryInstance );  

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
    
      async findAllCategories( id: string, paginationDto: PaginationDto ) {
    
        const { limit = 10, offset = 0 } = paginationDto;
        const company = await this.companyService.findCompanyByTerm( id )
    
        const categories = await this.productCategoryRepository.find({
          take: limit,   
          skip: offset, 
          where: {
            company: {
              id: company.id
            }
          }
        })
    
        return categories.map( ({ id, category }) => ({
          id,
          category,
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