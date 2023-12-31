import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [ LocationsController ],
  providers: [ LocationsService ],
  imports: [ 
    TypeOrmModule.forFeature([ Location ]),
    CommonModule,
    CompanyModule
  ],
  exports: [
    TypeOrmModule,
    LocationsService
  ]
})
export class LocationsModule {}
