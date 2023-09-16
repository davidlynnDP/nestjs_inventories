import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 


import { CreateInventoryMovementDto } from './dto';
import { InventoryMovement } from './entities';
import { CommonService } from 'src/common/common.service';
import { CompanyService } from 'src/company/company.service';
import { LocationsService } from 'src/locations/locations.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities';
import { PaginationDto } from 'src/common/dtos';

type OptionsFindAllMovement = "location" | "company";
type OptionsFindByMovement = "flattened" | "products" | "company" | "locations";


@Injectable()
export class InventoryMovementsService {


  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>, 

    private readonly companyService: CompanyService,

    private readonly locationsService: LocationsService,

    private readonly productsService: ProductsService,

    private readonly commonService: CommonService,
  ) {}

  async createInventoryMovement(createInventoryMovementDto: CreateInventoryMovementDto) {

    const { productsIds, sourceLocation:startLocation, destinationLocation:endLocation, idCompany, ...aboutMovement } = createInventoryMovementDto;
    const company = await this.companyService.findCompanyByTerm( idCompany );
    const sourceLocation = await this.locationsService.findLocationByTerm( startLocation );
    const destinationLocation = await this.locationsService.findLocationByTerm( endLocation );

    const productPromises: Promise<Product>[] = [];

    productsIds.forEach( productId => {
      productPromises.push( this.productsService.findProductByTerm( productId ) );
    });

   const products = await Promise.all( productPromises );

    try {
      
      const inventoryMovement = this.inventoryMovementRepository.create({ 
        ...aboutMovement,
        company,
        sourceLocation,
        destinationLocation,
        affectedProducts: products,
        amount: products.length //cantidad de productos afectados por el movimiento de inventario	
      });
      
      return await this.inventoryMovementRepository.save( inventoryMovement );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllBy( id: string, paginationDto: PaginationDto, options: OptionsFindAllMovement ) {

    switch ( options ) {
      case 'location':
        return await this.findAllInventoryMovementsByLocation( id, paginationDto );
      case 'company':
        return await this.findAllInventoryMovementsByCompany( id, paginationDto );
      default:
        throw new Error(`No search option specified`);
    }
  }

  async findAllInventoryMovementsByLocation( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const location = await this.locationsService.findLocationByTerm( id );

    const movements = await this.inventoryMovementRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        sourceLocation: {
          id: location.id
        }
      }
    })

    return movements.map( ({ company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement }) => ({
      ...aboutMovement
    }))
  }

  async findAllInventoryMovementsByCompany( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id );

    const movements = await this.inventoryMovementRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        company: {
          id: company.id
        }
      }
    })

    return movements.map( ({ company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement }) => ({
      ...aboutMovement
    }))
  }

  async findInventoryMovementByTerm( term: string ): Promise<InventoryMovement> {

    let movement: InventoryMovement;

    if ( isUUID( term ) ) {
      movement = await this.inventoryMovementRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.inventoryMovementRepository.createQueryBuilder('movements'); 
      movement = await queryBuilder
        .where('inventoryMovementType =:inventoryMovementType', {   
          inventoryMovementType: term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !movement ) 
      throw new NotFoundException(`Inventory Movement with the term ${ term } not found`); 

    return movement;
  }

  async findInventoryMovementBy( term: string, options: OptionsFindByMovement = 'flattened' ) {

    switch ( options ) {
      case 'products':
        return await this.findInventoryMovementWithProducts( term );
      case 'company':
        return await this.findInventoryMovementWithCompany( term );
      case 'locations':
        return await this.findInventoryMovementWithStartAndEndLocations( term );
      default:
        return await this.findInventoryMovementPlained( term );
    }
  }
  async findInventoryMovementPlained( term: string ) {

    const movement = await this.findInventoryMovementByTerm( term );
    const { company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement } = movement;

    return {
      ...aboutMovement,
    }
  }

  async findInventoryMovementWithProducts( term: string ) {

    const movement = await this.findInventoryMovementByTerm( term );
    const { company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement } = movement;

    return {
      ...aboutMovement,
      products: affectedProducts.map( product => product.id )
    }
  }

  async findInventoryMovementWithStartAndEndLocations( term: string ) {

    const movement = await this.findInventoryMovementByTerm( term );
    const { company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement } = movement;

    return {
      ...aboutMovement,
      startLocation: sourceLocation.id,
      endLocation: destinationLocation.id
    }
  }

  async findInventoryMovementWithCompany( term: string ) {

    const movement = await this.findInventoryMovementByTerm( term );
    const { company, sourceLocation, destinationLocation, affectedProducts, ...aboutMovement } = movement;

    return {
      ...aboutMovement,
      company: company.id
    }
  }


  async deleteAllMovements() {

    const query = this.inventoryMovementRepository.createQueryBuilder('movements'); 

    try {
      return await query
        .delete()
        .where({})  
        .execute();

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }
}
