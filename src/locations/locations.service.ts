import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateLocationDto, UpdateLocationDto } from './dto';
import { Location } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>, 

    private readonly commonService: CommonService,
  ) {}

  async createLocation( createLocationDto: CreateLocationDto ) {

    try {
      
      const location = this.locationRepository.create({ 
        ...createLocationDto
      });
      
      return await this.locationRepository.save( location );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllLocations( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const locations = await this.locationRepository.find({
      take: limit,   
      skip: offset,  
      relations: {
        products: true,
      }
    })

    return locations.map( ({ products, ...location }) => ({
      ...location,
      products: products.map( product => product.title )
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

  async findLocationByTermPlained( term: string ) {
    
    const location = await this.findLocationByTerm( term );
    const { products, movements, ...aboutLocation } = location;

    return {
      ...aboutLocation,
      products: products.map( product => product.title )
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
