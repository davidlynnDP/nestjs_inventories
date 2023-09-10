import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities';

@Module({
  controllers: [ OrdersController ],
  providers: [ OrdersService ],
  imports: [ 
    TypeOrmModule.forFeature([ Order ])
  ],
  exports: [
    TypeOrmModule,
    OrdersService
  ]
})
export class OrdersModule {}
