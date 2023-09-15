import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [ SuppliersController ],
  providers: [ SuppliersService ],
  imports: [ 
    TypeOrmModule.forFeature([ Supplier ]),
    CommonModule,
    CompanyModule
  ],
  exports: [
    TypeOrmModule,
    SuppliersService
  ]
})
export class SuppliersModule {}
