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
import { CompanyService } from 'src/company/company.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { LocationsService } from 'src/locations/locations.service';


type OptionsFindProduct = "flattened" | "category-and-images" | "company" | "supplier" | "locations" | "movements";


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, 

    private readonly productImagesService: ProductImagesService, 

    private readonly companyService: CompanyService,

    private readonly suppliersService: SuppliersService,

    private readonly locationsService: LocationsService,

    private readonly productCategoriesService: ProductCategoriesService, 

    private readonly commonService: CommonService,
  ) {}


  async createProduct( createProductDto: CreateProductDto ) {
    
    const { category:cat, idCompany, idSupplier, idLocation, ...productDetails } = createProductDto;
    const category = await this.productCategoriesService.createProductCategory( cat );
    const company = await this.companyService.findCompanyByTerm( idCompany );
    const supplier = await this.suppliersService.findSupplierByTerm( idSupplier );
    const location = await this.locationsService.findLocationByTerm( idLocation );

    //* corregir entity product-location
    try {
      
      const product = this.productRepository.create({ 
        ...productDetails,
        category,
        company,
        supplier,
        locations: location
      });
      
      await this.productRepository.save( product );  

      return { ...productDetails, cat };
      
    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllProducts( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id )

    const products = await this.productRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        company: {
          id: company.id
        }
      }
    })

    return products.map( ({ company, supplier, locations, movements, images, category, ...aboutProduct }) => ({
      ...aboutProduct
    }))
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

  async findProductBy( term: string, options: OptionsFindProduct = 'flattened' ) {

    switch ( options ) {
      case 'supplier':
        return await this.findProductWithSupplier( term );
      case 'company':
        return await this.findProductWithCompany( term );
      case 'category-and-images':
        return await this.findProductWithCategoryAndImages( term );
      case 'locations':
        return await this.findProductWithLocations( term );
      case 'movements':
          return await this.findProductWithMovements( term );
      default:
        return await this.findProductPlained( term );
    }
  }

  async findProductPlained( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
    }
  }

  async findProductWithCategoryAndImages( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
      images: images.map( image => image.url ),
      category: category.category
    }
  }

  async findProductWithCompany( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
      company: company.companyName
    }
  }


  async findProductWithSupplier( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
      supplier: supplier.fullName
    }
  }

  async findProductWithLocations( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
      locations: locations.locationName
    }
  }

  async findProductWithMovements( term: string ) {

    const product = await this.findProductByTerm( term );
    const { company, supplier, locations, movements, images, category, ...aboutProduct } = product;

    return {
      ...aboutProduct,
      movements: movements.map( movement => movement.id )
    }
  }



  async updateProduct( id: string, updateProductDto: UpdateProductDto ) {

    const { category:cat, ...productToUpdate } = updateProductDto;
    
    await this.findProductByTerm( id );
    const category = await this.productCategoriesService.createProductCategory( cat );

    try {
      const product = await this.productRepository.preload({ 
        id, 
        ...productToUpdate, 
        category 
      });

      return await this.productRepository.save( product );  

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
