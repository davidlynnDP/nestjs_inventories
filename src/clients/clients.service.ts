import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateClientDto, UpdateClientDto } from './dto';
import { Client } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';
import { CompanyService } from 'src/company/company.service';

type OptionsFindClient = "flattened" | "company" | "orders";


@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>, 

    private readonly companyService: CompanyService,

    private readonly commonService: CommonService,
  ) {}


  async createClient( createClientDto: CreateClientDto ) {

    const { idCompany, ...aboutClient } = createClientDto;
    const company = await this.companyService.findCompanyByTerm( idCompany )

    try {
      
      const client = this.clientRepository.create({ 
        ...aboutClient,
        company
      });
      
      return await this.clientRepository.save( client );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllClients( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id )

    const clients = await this.clientRepository.find({
      take: limit,   
      skip: offset, 
      where: {
        company: {
          id: company.id
        }
      } 
    })

    return clients.map( ({ company, orders, ...aboutClient }) => ({
      ...aboutClient
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

  async findClientBy( term: string, options: OptionsFindClient = 'flattened' ) {

    switch ( options ) {
      case 'orders':
        return await this.numberOfOrdersByThisCustomer( term );
      case 'company':
        return await this.findClientWithCompany( term );
      default:
        return await this.findClientPlained( term );
    }

  }

  async findClientPlained( term: string ) {
    
    const client = await this.findClientByTerm( term );
    const { company, orders, ...aboutClient } = client;

    return {
      ...aboutClient,
    }

  }

  async numberOfOrdersByThisCustomer( term: string ) {
    
    const client = await this.findClientByTerm( term );
    const { company, orders, ...aboutClient } = client;

    return {
      ...aboutClient,
      orders: orders.length
    }

  }

  async findClientWithCompany( term: string ) {
    
    const client = await this.findClientByTerm( term );
    const { company, orders, ...aboutClient } = client;

    return {
      ...aboutClient,
      company: company.companyName
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


  async deleteClient( id: string ) {
    
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
