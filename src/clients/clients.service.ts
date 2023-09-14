import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateClientDto, UpdateClientDto } from './dto';
import { Client } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';


@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, 

    private readonly commonService: CommonService,
  ) {}


  async createClient( createClientDto: CreateClientDto ) {

    try {
      
      const client = this.clientRepository.create({ 
        ...createClientDto
      });
      
      return await this.clientRepository.save( client );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllClients( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const clients = await this.clientRepository.find({
      take: limit,   
      skip: offset,  
    })

    return clients.map( ( client ) => ({
      ...client,
    }))

  }

  async findClientByTerm( term: string ): Promise<Client> {
    
    let client: Client;

    if ( isUUID( term ) ) {
      client = await this.clientRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.clientRepository.createQueryBuilder('client'); 
      client = await queryBuilder
        .where('email =:email or phoneNumber =:phoneNumber', {   
          email:        term.toLowerCase(),
          phoneNumber:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !client ) 
      throw new NotFoundException(`Client with the term ${ term } not found`); 

    return client;
  }

  async findClientByTermPlained( term: string ) {
    
    const supplier = await this.findClientByTerm( term );
    const { orders, ...aboutClient } = supplier;

    return {
      ...aboutClient,
    }

  }

  async updateClient( id: string, updateclientDto: UpdateClientDto ): Promise<Client> {
    
    await this.findClientByTerm( id );

    try {
      const client = await this.clientRepository.preload({ 
        id, 
        ...updateclientDto, 
      });

      return await this.clientRepository.save( client );  

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }


  async deleteSupplier( id: string ) {
    
    const client = await this.findClientByTerm( id ); 

    try {
      await this.clientRepository.remove( client );

      return `Successful client removal`;
      
    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
    
  }

  async deleteAllClients() {

    const query = this.clientRepository.createQueryBuilder('client'); 

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
