import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [ ClientsController ],
  providers: [ ClientsService ],
  imports: [ 
    TypeOrmModule.forFeature([ Client ]),
    CommonModule,
    CompanyModule
  ],
  exports: [
    TypeOrmModule,
    ClientsService
  ]
})
export class ClientsModule {}
