import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ ClientsController ],
  providers: [ ClientsService ],
  imports: [ 
    TypeOrmModule.forFeature([ Client ]),
    CommonModule
  ],
  exports: [
    TypeOrmModule,
    ClientsService
  ]
})
export class ClientsModule {}
