import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { InventoryMovementsModule } from './inventory-movements/inventory-movements.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { LocationsModule } from './locations/locations.module';
import { CompanyModule } from './company/company.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',  // es lo mismo a definir - process.env.STAGE === 'prod' ? true : false
      extra: {
        ssl: process.env.STAGE === 'prod'
              ? { rejectUnauthorized: false }  
              : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,           
      port: +process.env.DB_PORT,          
      database: process.env.DB_NAME,       
      username: process.env.DB_USERNAME,   
      password: process.env.DB_PASSWORD,   
      autoLoadEntities: true,              
      synchronize: true,                   
    }),

    ProductsModule,

    SeedModule,

    InventoryMovementsModule,

    SuppliersModule,

    LocationsModule,

    CompanyModule,

    ClientsModule,

    OrdersModule,

    CommonModule,

    CloudinaryModule,
  ],
})
export class AppModule {}
