import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ CompanyController ],
  providers: [ CompanyService ],
  imports: [ 
    TypeOrmModule.forFeature([ Company ]),
    CommonModule
  ],
  exports: [
    TypeOrmModule,
    CompanyService
  ]
})
export class CompanyModule {}
