import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from 'src/company/company.module';
import { ProductsModule } from 'src/products/products.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [ OrdersController ],
  providers: [ OrdersService ],
  imports: [ 
    TypeOrmModule.forFeature([ Order ]),
    CommonModule,
    CompanyModule,
    ProductsModule,
    ClientsModule
  ],
  exports: [
    TypeOrmModule,
    OrdersService
  ]
})
export class OrdersModule {}
