import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ SuppliersController ],
  providers: [ SuppliersService ],
  imports: [ 
    TypeOrmModule.forFeature([ Supplier ])
  ],
  exports: [
    TypeOrmModule,
    SuppliersService
  ]
})
export class SuppliersModule {}
