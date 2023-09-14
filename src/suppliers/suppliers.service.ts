import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { Supplier } from './entities';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dtos';


@Injectable()
export class SuppliersService {

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>, 

    private readonly commonService: CommonService,
  ) {}


  async createSupplier( createSupplierDto: CreateSupplierDto ) {

    try {
      
      const supplier = this.supplierRepository.create({ 
        ...createSupplierDto
      });
      
      return await this.supplierRepository.save( supplier );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
  }

  async findAllSuppliers( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    const suppliers = await this.supplierRepository.find({
      take: limit,   
      skip: offset,  
      relations: {
        products: true
      }
    })

    return suppliers.map( ( supplier ) => ({
      ...supplier,
      products: supplier.products.map( product => product.title )
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

  async findSupplierByTermPlained( term: string ) {
    
    const supplier = await this.findSupplierByTerm( term );
    const { products, ...aboutSupplier } = supplier;

    return {
      ...aboutSupplier,
      products: products.map( product => product.title )
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
