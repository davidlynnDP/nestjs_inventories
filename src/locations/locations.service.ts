import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateLocationDto, UpdateLocationDto } from './dto';
import { Location } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';
import { CompanyService } from 'src/company/company.service';


type OptionsFindLocation = "flattened" | "products" | "company" | "movements";


@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>, 

    private readonly companyService: CompanyService,

    private readonly commonService: CommonService,
  ) {}

  async createLocation( createLocationDto: CreateLocationDto ) {

    const { idCompany, ...aboutLocation } = createLocationDto;
    const company = await this.companyService.findCompanyByTerm( idCompany )

    try {
      
      const location = this.locationRepository.create({ 
        ...aboutLocation,
        company
      });
      
      return await this.locationRepository.save( location );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllLocations( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id )

    const locations = await this.locationRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        company: {
          id: company.id
        }
      }
    })

    return locations.map( ({ company, movements, products, ...aboutLocation }) => ({
      ...aboutLocation
    }))

  }

  async findLocationByTerm( term: string ): Promise<Location> {
    
    let location: Location;

    if ( isUUID( term ) ) {
      location = await this.locationRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.locationRepository.createQueryBuilder('location'); 
      location = await queryBuilder
        .where('locationName =:locationName', {   
          locationName: term,
        })
        .getOne(); 
    }

    if ( !location ) 
      throw new NotFoundException(`Location with the term ${ term } not found`); 

    return location;
  }

  async findLocationBy( term: string, options: OptionsFindLocation = 'flattened' ) {

    switch ( options ) {
      case 'products':
        return await this.findLocationWithProducts( term );
      case 'company':
        return await this.findLocationWithCompany( term );
      case 'movements':
        return await this.findLocationWithMovements( term );
      default:
        return await this.findLocationPlained( term );
    }
    
  }

  async findLocationPlained( term: string ) {
    
    const location = await this.findLocationByTerm( term );
    const { company, movements, products, ...aboutLocation } = location;

    return {
      ...aboutLocation,
    }
  }

  async findLocationWithProducts( term: string ) {
    
    const location = await this.findLocationByTerm( term );
    const { company, movements, products, ...aboutLocation } = location;

    return {
      ...aboutLocation,
      products: products.map( ({ id, title, code }) => ({
        id,
        title,
        code
      }))
    }
  }

  async findLocationWithCompany( term: string ) {
    
    const location = await this.findLocationByTerm( term );
    const { company, movements, products, ...aboutLocation } = location;

    return {
      ...aboutLocation,
      company: company.companyName
    }
  }

  async findLocationWithMovements( term: string ) {
    
    const location = await this.findLocationByTerm( term );
    const { company, movements, products, ...aboutLocation } = location;

    return {
      ...aboutLocation,
      movements: movements.map( ({ id, inventoryMovementDate, inventoryMovementType }) => ({
        id,
        inventoryMovementDate,
        inventoryMovementType
      }))
    }
  }

  async updateLocation( id: string, updateLocationDto: UpdateLocationDto ): Promise<Location> {
    
    await this.findLocationByTerm( id );

    try {
      const location = await this.locationRepository.preload({ 
        id, 
        ...updateLocationDto, 
      });

      return await this.locationRepository.save( location );  

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }


  async deleteLocation( id: string ) {
    
    const location = await this.findLocationByTerm( id ); 

    try {
      await this.locationRepository.remove( location );

      return `Successful location removal`;
      
    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
    
  }

  async deleteAllLocations() {

    const query = this.locationRepository.createQueryBuilder('location'); 

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
