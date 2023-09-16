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
import * as seed from './seed-information';



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

    const company = await this.insertCompanies();  
    const supplier = await this.insertSuppliers( company.id );  
    const location = await this.insertocations( company.id );  
    await this.insertProducts( company.id, supplier.id, location.id );  
    await this.insertClients( company.id );  

    return 'Executed seed';
  }

  private async insertCompanies() {

    const companiesSeed = seed.companiesInformation;
    const companiesPromises = [];

    companiesSeed.forEach( company => {
      companiesPromises.push( this.companiesService.createCompany( company ) );
    });

    const companies = await Promise.all( companiesPromises );
    return companies[0];
  }

  private async insertSuppliers( idCompany: string ) {

    const suppliersSeed = seed.supplierInformation;
    const suppliersPromises = [];

    suppliersSeed.forEach( supplier => {
      suppliersPromises.push( this.suppliersService.createSupplier({ idCompany, ...supplier }) );
    });

    const suppliers = await Promise.all( suppliersPromises );
    return suppliers[0];
  }

  private async insertocations( idCompany: string ) {

    const locationsSeed = seed.locationsInformation;
    const locationsPromises = [];

    locationsSeed.forEach( location => {
      locationsPromises.push( this.locationsService.createLocation({ idCompany, ...location }) );
    });

    const locations = await Promise.all( locationsPromises );
    return locations[0];
  }

  private async insertClients( idCompany: string ) {

    const clientsSeed = seed.clientsInformation;
    const clientsPromises = [];

    clientsSeed.forEach( client => {
      clientsPromises.push( this.clientsService.createClient({ idCompany, ...client }) );
    });

    const clients = await Promise.all( clientsPromises );
    return clients[0];
  }

  private async insertProducts( idCompany: string, idSupplier: string, idLocation: string ) {

    const productsSeed = seed.productInformation;
    const productsPromises = [];

    productsSeed.forEach( product => {
      productsPromises.push( this.productsService.createProduct({ idCompany, idSupplier, idLocation, ...product }) );
    });

    const products = await Promise.all( productsPromises );
    return products[0];
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
