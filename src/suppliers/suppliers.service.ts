import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { Supplier } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';
import { CompanyService } from 'src/company/company.service';


type OptionsFindSupplier = "flattened" | "products" | "company";

@Injectable()
export class SuppliersService {

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>, 

    private readonly companyService: CompanyService,

    private readonly commonService: CommonService,
  ) {}


  async createSupplier( createSupplierDto: CreateSupplierDto ) {

    const { idCompany, ...aboutSupplier } = createSupplierDto;
    const company = await this.companyService.findCompanyByTerm( idCompany )

    try {
      
      const supplier = this.supplierRepository.create({ 
        ...aboutSupplier,
        company
      });
      
      return await this.supplierRepository.save( supplier );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllSuppliers( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id )

    const suppliers = await this.supplierRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        company: {
          id: company.id
        }
      }
    })

    return suppliers.map( ({ products, company, ...aboutSupplier }) => ({
      ...aboutSupplier
    }))

  }

  async findSupplierByTerm( term: string ): Promise<Supplier> {
    
    let supplier: Supplier;

    if ( isUUID( term ) ) {
      supplier = await this.supplierRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.supplierRepository.createQueryBuilder('supplier'); 
      supplier = await queryBuilder
        .where('email =:email or phoneNumber =:phoneNumber', {   
          email:        term.toLowerCase(),
          phoneNumber:  term.toLowerCase(),
        })
        .getOne(); 
    }

    if ( !supplier ) 
      throw new NotFoundException(`Supplier with the term ${ term } not found`); 

    return supplier;
  }

  async findSupplierBy( term: string, options: OptionsFindSupplier = 'flattened' ) {

    switch ( options ) {
      case 'products':
        return await this.findSupplierWithProducts( term );
      case 'company':
        return await this.findSupplierWithCompany( term );
      default:
        return await this.findSupplierPlained( term );
    }
  }

  async findSupplierPlained( term: string ) {
    
    const supplier = await this.findSupplierByTerm( term );
    const { products, company, ...aboutSupplier } = supplier;

    return {
      ...aboutSupplier,
    }

  }

  async findSupplierWithCompany( term: string ) {
    
    const supplier = await this.findSupplierByTerm( term );
    const { products, company, ...aboutSupplier } = supplier;


    return {
      ...aboutSupplier,
      company: company.companyName
    }
  }

  async findSupplierWithProducts( term: string ) {
    
    const supplier = await this.findSupplierByTerm( term );
    const { products, company, ...aboutSupplier } = supplier;


    return {
      ...aboutSupplier,
      products: products.map( ({ id, title, code }) => ({
        id,
        title,
        code
      }))
    }
  }


  async updateSupplier( id: string, updateSupplierDto: UpdateSupplierDto ): Promise<Supplier> {
    
    await this.findSupplierByTerm( id );

    try {
      const supplier = await this.supplierRepository.preload({ 
        id, 
        ...updateSupplierDto, 
      });

      return await this.supplierRepository.save( supplier );  

    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
  }


  async deleteSupplier( id: string ) {
    
    const product = await this.findSupplierByTerm( id ); 

    try {
      await this.supplierRepository.remove( product );

      return `Successful supplier removal`;
      
    } catch ( error ) {
      this.commonService.errorHandler( error )
    }
    
  }

  async deleteAllSuppliers() {

    const query = this.supplierRepository.createQueryBuilder('supplier'); 

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
