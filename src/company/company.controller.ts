import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('company') // localhost:3000/api/company
export class CompanyController {

  constructor(
    private readonly companyService: CompanyService
  ) {}

  @Post() // localhost:3000/api/company - POST
  createCompany(
    @Body() createCompanyDto: CreateCompanyDto
  ) {
    return this.companyService.createCompany( createCompanyDto );
  }
 
  @Get() // localhost:3000/api/company - GET
  findAllCompanies(
    @Query() paginationDto: PaginationDto
  ) {
    return this.companyService.findAllCompanies( paginationDto );
  }

  @Get('plained/:term') // localhost:3000/api/company/plained/:term - GET
  findCompanyPlained(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  //! corregir
  @Get('with-products/:term') // localhost:3000/api/company/with-products/:term - GET
  findCompanyWithProducts(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  @Get('with-clients/:term') // localhost:3000/api/company/with-clients/:term - GET
  findCompanyWithClients(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  @Get('with-suppliers/:term') // localhost:3000/api/company/with-suppliers/:term - GET
  findCompanyWithSuppliers(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  @Get('with-locations/:term') // localhost:3000/api/company/with-locations/:term - GET
  findCompanyWithLocations(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  @Get('with-categories/:term') // localhost:3000/api/company/with-categories/:term - GET
  findCompanyWithCategories(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  //! crear
  @Get('number-of-orders-shipped/:term') // localhost:3000/api/company/number-of-orders-shipped/:term - GET
  numberOfOrdersShippedPerCompany(
    @Param( 'term' ) term: string
  ) {
    return this.companyService.findCompanyByTermPlained( term );
  }

  @Patch(':id') // localhost:3000/api/company/:id - PATCH
  updateCompany(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return this.companyService.updateCompany( id, updateCompanyDto );
  }

  @Delete(':id') // localhost:3000/api/company/:id - DELETE
  deleteCompany(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.companyService.deleteCompany( id );
  }
}
