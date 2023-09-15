import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('clients') // localhost:3000/api/clients
export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService
  ) {}

  @Post() // localhost:3000/api/clients - POST
  createClient(
    @Body() createClientDto: CreateClientDto
  ) {
    return this.clientsService.createClient( createClientDto );
  }

  @Get('/:id') // localhost:3000/api/clients/:id - GET
  findAllClients(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.clientsService.findAllClients( id, paginationDto );
  }

  @Get('plained/:term') // localhost:3000/api/clients/plained/:term - GET
  findClientPlained(
    @Param( 'term' ) term: string
  ) {
    return this.clientsService.findClientBy( term );
  }

  @Get('number-of-orders-by-this-customer/:term') // localhost:3000/api/clients/number-of-orders-by-this-customer/:term - GET
  numberOfOrdersByThisCustomer(
    @Param( 'term' ) term: string
  ) {
    return this.clientsService.findClientBy( term, "orders");
  }

  @Get('with-company/:term') // localhost:3000/api/clients/with-company/:term - GET
  findClientWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.clientsService.findClientBy( term, "company");
  }

  @Patch(':id') // localhost:3000/api/clients/:id - PATCH
  updateClient(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.updateClient( id, updateClientDto );
  }

  @Delete(':id') // localhost:3000/api/clients/:id - DELETE
  deleteClient(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.clientsService.deleteClient( id );
  }
}
