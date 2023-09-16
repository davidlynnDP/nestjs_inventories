import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';

import { InventoryMovementsService } from './inventory-movements.service';
import { CreateInventoryMovementDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('inventory-movements') // localhost:3000/api/inventory-movements
export class InventoryMovementsController {
  constructor(
    private readonly inventoryMovementsService: InventoryMovementsService
  ) {}

  @Post() // localhost:3000/api/inventory-movements - POST
  createInventoryMovement(
    @Body() createInventoryMovementDto: CreateInventoryMovementDto
  ) {
    return this.inventoryMovementsService.createInventoryMovement( createInventoryMovementDto );
  }

  @Get('by-location/:id') // localhost:3000/api/inventory-movements/by-location/:id - GET
  findAllInventoryMovementsByLocation(
    @Param('id', ParseUUIDPipe ) id: string, //idLocation
    @Query() paginationDto: PaginationDto
  ) {
    return this.inventoryMovementsService.findAllBy( id, paginationDto, "location");
  }

  @Get('by-company/:id') // localhost:3000/api/inventory-movements/by-company/:id - GET
  findAllInventoryMovementsByCompany(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.inventoryMovementsService.findAllBy( id, paginationDto, "company");
  }

  @Get('plained/:term') // localhost:3000/api/inventory-movements/plained/:term - GET
  findInventoryMovementPlained(
    @Param( 'term' ) term: string
  ) {
    return this.inventoryMovementsService.findInventoryMovementBy( term );
  }

  @Get('with-products/:term') // localhost:3000/api/inventory-movements/with-products/:term - GET
  findInventoryMovementWithProducts(
    @Param( 'term' ) term: string
  ) {
    return this.inventoryMovementsService.findInventoryMovementBy( term, "products");
  }

  @Get('with-locations-start-end/:term') // localhost:3000/api/inventory-movements/with-locations-start-end/:term - GET
  findInventoryMovementWithStartAndEndLocations(
    @Param( 'term' ) term: string
  ) {
    return this.inventoryMovementsService.findInventoryMovementBy( term, "locations");
  }
  @Get('with-company/:term') // localhost:3000/api/inventory-movements/with-company/:term - GET
  findInventoryMovementWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.inventoryMovementsService.findInventoryMovementBy( term, "company");
  }
}
