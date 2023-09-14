import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { ClientsModule } from 'src/clients/clients.module';
import { CompanyModule } from 'src/company/company.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { LocationsModule } from 'src/locations/locations.module';
import { InventoryMovementsModule } from 'src/inventory-movements/inventory-movements.module';
import { CommonModule } from 'src/common/common.module';
import { OrdersModule } from 'src/orders/orders.module';


@Module({
  controllers: [ SeedController ],
  providers: [ SeedService ],
  imports: [
    ProductsModule,

    ClientsModule,

    CompanyModule,

    SuppliersModule,

    LocationsModule,

    InventoryMovementsModule,

    CommonModule,

    OrdersModule
  ]
})
export class SeedModule {}
