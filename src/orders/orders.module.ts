import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ OrdersController ],
  providers: [ OrdersService ],
  imports: [ 
    TypeOrmModule.forFeature([ Order ]),
    CommonModule
  ],
  exports: [
    TypeOrmModule,
    OrdersService
  ]
})
export class OrdersModule {}
