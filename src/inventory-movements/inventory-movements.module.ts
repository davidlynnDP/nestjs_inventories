import { Module } from '@nestjs/common';
import { InventoryMovementsService } from './inventory-movements.service';
import { InventoryMovementsController } from './inventory-movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryMovement } from './entities';

@Module({
  controllers: [ InventoryMovementsController ],
  providers: [ InventoryMovementsService ],
  imports: [ 
    TypeOrmModule.forFeature([ InventoryMovement ])
  ],
  exports: [
    TypeOrmModule,
    InventoryMovementsService
  ]
})
export class InventoryMovementsModule {}
