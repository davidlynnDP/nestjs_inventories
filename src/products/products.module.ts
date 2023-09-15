import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductCategories, ProductImage } from './entities';

import { CommonModule } from 'src/common/common.module';
import { ProductCategoriesService } from './product-categories.service';
import { ProductImagesService } from './product-images.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CompanyModule } from 'src/company/company.module';


@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService, ProductCategoriesService, ProductImagesService ],
  imports: [ 
    TypeOrmModule.forFeature([ Product, ProductImage, ProductCategories ]),
    CommonModule,
    CloudinaryModule,
    CompanyModule
  ],
  exports: [
    TypeOrmModule,
    ProductsService,
    ProductCategoriesService,
    ProductImagesService
  ]
})
export class ProductsModule {}
