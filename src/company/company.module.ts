import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities';

@Module({
  controllers: [ CompanyController ],
  providers: [ CompanyService ],
  imports: [ 
    TypeOrmModule.forFeature([ Company ])
  ],
  exports: [
    TypeOrmModule,
    CompanyService
  ]
})
export class CompanyModule {}