import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductCategories, ProductImage } from './entities';

@Module({
  controllers: [ ProductsController ],
  providers: [ ProductsService ],
  imports: [ 
    TypeOrmModule.forFeature([ Product, ProductImage, ProductCategories ])
  ],
  exports: [
    TypeOrmModule,
    ProductsService
  ]
})
export class ProductsModule {}
