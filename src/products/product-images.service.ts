import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { validate as isUUID } from 'uuid'; 

import { ProductImage } from "./entities";
import { CommonService } from "src/common/common.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { ProductsService } from "./products.service";
import { PaginationDto } from "src/common/dtos";





@Injectable()
export class ProductImagesService {

    constructor(
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>, 

        private readonly cloudinaryService: CloudinaryService,

        private readonly productsService: ProductsService,
        
        private readonly commonService: CommonService,
      ) {}


    async createProductWithMultipleImages( id: string, files: Express.Multer.File[] ): Promise<ProductImage[]> {

      if ( !id ) {
        throw new Error(`product id not specified`);
      }

      if ( !files ) {
        throw new Error(`No images files specified`);
      }

      const product = await this.productsService.findProductByTerm( id );

      const responseCloudinary = await this.cloudinaryService.uploadMultipleFiles( files );

      const hasError = this.commonService.cloudinaryMultipleResponseErrorHandling( responseCloudinary );

      if ( hasError ) {
        throw new Error(`Failed to upload files to Cloudinary`);
      }

      const productImages: ProductImage[] = [];

      responseCloudinary.forEach( ({ secure_url }) => {
        productImages.push( this.productImageRepository.create({
          url: secure_url,
          product
        }))  
      });
  
      return await this.productImageRepository.save( productImages ) 
    }

    
    async createProductWithSingleImage( id: string, file: Express.Multer.File ) {

      if ( !id ) {
        throw new Error(`product id not specified`);
      }

      if ( !file ) {
        throw new Error(`No image file specified`);
      }

      const product = await this.productsService.findProductByTerm( id );

      const responseCloudinary = await this.cloudinaryService.uploadSingleFile( file );

      const hasError = this.commonService.cloudinarySingleResponseErrorHandling( responseCloudinary );

      if ( hasError ) {
          throw new Error(`Failed to upload file to Cloudinary`);
      }

      const productImages = await this.productImageRepository.create({
          url: responseCloudinary.secure_url,
          product
      });
      
      return await this.productImageRepository.save( productImages );  
    }

    async deleteSingleImage( secureUrl: string ): Promise<string> {


      try {

        const imageId = this.cloudinaryService.getIdFromSecureURL( secureUrl );

        await this.cloudinaryService.deleteSingleFile( imageId );
  
        const image: ProductImage = await this.findImageBySecureUrl( secureUrl );
  
        await this.productImageRepository.remove( image );

        return `Product image successfully removed`
        
      } catch ( error ) {
        this.commonService.errorHandler( error );
      }

    }

    async deleteMultipleImages( secureUrls: string[] ): Promise<string>  {

      try {

        
        const imageIds = this.cloudinaryService.getIdsFromMultipleSecureURL( secureUrls );

        await this.cloudinaryService.deleteMultipleFilesById( imageIds );
    
        const images: ProductImage[] = await this.productImageRepository.find({  
          where: {
            id: In( imageIds )
          },
        });
        await this.productImageRepository.remove( images );

        return `Product images successfully removed`;
        
      } catch ( error ) {
        this.commonService.errorHandler( error );
      }

    }


    async findImageBySecureUrl( secureUrl: string ): Promise<ProductImage> {

      let image: ProductImage;

      if ( isUUID( secureUrl ) ) {
        image = await this.productImageRepository.findOneBy({ id: secureUrl });
      } else {
        image = await this.productImageRepository.findOneBy({ url: secureUrl })
      }
    
      if ( !image ) 
        throw new NotFoundException(`Image with the url ${ secureUrl } not found`); 
  
      return image;
    }
    

    async findAllImages( paginationDto: PaginationDto ) {
    
      const { limit = 10, offset = 0 } = paginationDto;
  
      const productImages = await this.productImageRepository.find({
        take: limit,   
        skip: offset, 
        relations: {
          product: true
        }
      })
  
      return productImages.map( ({ url, product }) => ({
        url,
        product: product.title
      }))
    }


    async deleteAllImages() {
      const query = this.productImageRepository.createQueryBuilder('productImage'); 

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