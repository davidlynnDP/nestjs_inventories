import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { ClientsService } from 'src/clients/clients.service';
import { CommonService } from 'src/common/common.service';
import { CompanyService } from 'src/company/company.service';
import { LocationsService } from 'src/locations/locations.service';
import { ProductsService } from 'src/products/products.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { InventoryMovementsService } from '../inventory-movements/inventory-movements.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductImagesService } from 'src/products/product-images.service';
import { ProductCategoriesService } from 'src/products/product-categories.service';



@Injectable()
export class SeedService {

  constructor(
    private readonly clientsService: ClientsService, 

    private readonly commonService: CommonService,

    private readonly companiesService: CompanyService, 

    private readonly inventoryMovementsService: InventoryMovementsService,

    private readonly locationsService: LocationsService, 

    private readonly ordersService: OrdersService,

    private readonly productsService: ProductsService, 

    private readonly productImagesService: ProductImagesService, 

    private readonly productCategoriesService: ProductCategoriesService, 

    private readonly suppliersService: SuppliersService,
  ) {}

  //* orders
  //* product_images
  //* product_categories
  //* inventory_movements
  //* locations
  //* suppliers
  //* products
  //* companies
  //* clients

  async populateDatabase(): Promise<string> {

    await this.deleteDataFromTables();

    /* insertar información */


    return 'Executed seed';
  }

  private async deleteDataFromTables(): Promise<void> {

    const deleteAll: Promise<DeleteResult>[] = [
      this.ordersService.deleteAllOrders(),
      this.productImagesService.deleteAllImages(),
      this.productCategoriesService.deleteAllCategories(),
      this.inventoryMovementsService.deleteAllMovements(),
      this.locationsService.deleteAllLocations(),
      this.suppliersService.deleteAllSuppliers(),
      this.productsService.deleteAllProducts(),
      this.companiesService.deleteAllCompanies(),
      this.clientsService.deleteAllClients(),
    ];
  
    try {
      await Promise.all( deleteAll );

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }

  }
}
