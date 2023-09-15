import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 
import * as bcrypt from 'bcryptjs'; 

import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Company } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';

type OptionsFindCompany = 'flattened' | 'orders' | 'products' | 'clients' | 'suppliers' | 'locations' | 'categories'

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>, 

    private readonly commonService: CommonService,
  ) {}


  async createCompany( createCompanyDto: CreateCompanyDto ) {

    const { password, ...companyWithoutPassword } = createCompanyDto;
    const salt = bcrypt.genSaltSync( 10 );

    try {
      
      const company = this.companyRepository.create({ 
        ...companyWithoutPassword,
        password: bcrypt.hashSync( password, salt )
      });
      
      await this.companyRepository.save( company );  
      delete company.password; 

      return {
        ...company
      }

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllCompanies( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const companies = await this.companyRepository.find({
      take: limit,   
      skip: offset, 
    })

    return companies.map( ({ orders, products, clients, suppliers, locations, categories, ...aboutCompany }) => ({
      company: aboutCompany
    }))

  }

  async findCompanyByTerm( term: string ): Promise<Company> {
    
    let company: Company;

    if ( isUUID( term ) ) {
      company = await this.companyRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.companyRepository.createQueryBuilder('company'); 
      company = await queryBuilder
        .where('email =:email or phoneNumber =:phoneNumber', {   
          email:        term.toLowerCase(),
          phoneNumber:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !company ) 
      throw new NotFoundException(`Company with the term ${ term } not found`); 

    return company;
  }

  async findCompanyBy( term: string, options: OptionsFindCompany = 'flattened' ) {

    switch ( options ) {
      case 'categories':
        return await this.findCompanyWithCategories( term );
      case 'clients':
        return await this.findCompanyWithClients( term );
      case 'locations':
        return await this.findCompanyWithLocations( term );
      case 'orders':
        return await this.numberOfOrdersShippedPerCompany( term );
      case 'products':
        return await this.findCompanyWithProducts( term );
      case 'suppliers':
        return await this.findCompanyWithSuppliers( term );
      default:
        return await this.findCompanyPlained( term );
    }

  }

  async findCompanyPlained( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany
    }
  }

  async findCompanyWithProducts( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      products: products.map( ({ id, title, code }) => ({
        id,
        title,
        code
      }))
    }
  }

  async findCompanyWithClients( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      clients: clients.map( ({ id, fullName, email }) => ({
        id,
        fullName,
        email
      }))
    }
  }

  async findCompanyWithSuppliers( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      suppliers: suppliers.map( ({ id, fullName, email }) => ({
        id,
        fullName,
        email
      }))
    }
  }

  async findCompanyWithLocations( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      locations: locations.map( ({ id, locationName, locationAddress }) => ({
        id,
        locationName,
        locationAddress
      }))
    }
  }

  async findCompanyWithCategories( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      categories: categories.map( ({ id, category }) => ({
        id,
        category
      }))
    }
  }

  async numberOfOrdersShippedPerCompany( term: string ) {
    
    const company = await this.findCompanyByTerm( term );
    const { orders, products, clients, suppliers, locations, categories, ...aboutCompany } = company;

    return { 
      ...aboutCompany,
      orders: orders.length
    }
  }

  async updateCompany( id: string, updateCompanyDto: UpdateCompanyDto ): Promise<Company> {
    
    await this.findCompanyByTerm( id );

    try {
      const company = await this.companyRepository.preload({ 
        id, 
        ...updateCompanyDto, 
      });

      return await this.companyRepository.save( company );  

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }


  async deleteCompany( id: string ) {
    
    const product = await this.findCompanyByTerm( id ); 

    try {
      await this.companyRepository.remove( product );

      return `Successful company removal`;
      
    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
    
  }

  async deleteAllCompanies() {

    const query = this.companyRepository.createQueryBuilder('company'); 

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
