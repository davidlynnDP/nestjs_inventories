import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('suppliers') // localhost:3000/api/suppliers
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService
  ) {}

  @Post() // localhost:3000/api/suppliers - POST
  createSupplier( 
    @Body() createSupplierDto: CreateSupplierDto 
  ) {
    return this.suppliersService.createSupplier( createSupplierDto );
  }

  @Get('/:id') // localhost:3000/api/suppliers/:id - GET
  findAllSuppliers(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.suppliersService.findAllSuppliers( id, paginationDto );
  }

  @Get('with-products/:term') // localhost:3000/api/suppliers/with-products/:term - GET
  findSupplierWithProducts(
    @Param( 'term' ) term: string
  ) {
    return this.suppliersService.findSupplierBy( term, 'products');
  }

  @Get('with-company/:term') // localhost:3000/api/suppliers/with-company/:term - GET
  findSupplierWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.suppliersService.findSupplierBy( term, 'company');
  }

  @Get('plained/:term') // localhost:3000/api/suppliers/plained/:term - GET
  findSupplierPlained(
    @Param( 'term' ) term: string
  ) {
    return this.suppliersService.findSupplierBy( term );
  }

  @Patch(':id') // localhost:3000/api/suppliers/:id - PATCH
  updateSupplier(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto
  ) {
    return this.suppliersService.updateSupplier( id, updateSupplierDto );
  }

  @Delete(':id') // localhost:3000/api/suppliers/:id - DELETE
  deleteSupplier(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.suppliersService.deleteSupplier( id );
  }
}
