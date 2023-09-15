import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('locations') // localhost:3000/api/locations
export class LocationsController {

  constructor(
    private readonly locationsService: LocationsService
  ) {}

  @Post() // localhost:3000/api/locations - POST
  createLocation(
    @Body() createLocationDto: CreateLocationDto
  ) {
    return this.locationsService.createLocation( createLocationDto );
  }

  @Get('/:id') // localhost:3000/api/locations/:id - GET
  findAllLocations(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.locationsService.findAllLocations( id, paginationDto );
  }

  @Get('plained/:term') // localhost:3000/api/locations/plained/:term - GET
  findLocationPlained(
    @Param( 'term' ) term: string
  ) {
    return this.locationsService.findLocationBy( term );
  }

  @Get('with-products/:term') // localhost:3000/api/locations/with-products/:term - GET
  findLocationWithProducts(
    @Param( 'term' ) term: string
  ) {
    return this.locationsService.findLocationBy( term, 'products');
  }

  @Get('with-company/:term') // localhost:3000/api/locations/with-company/:term - GET
  findLocationWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.locationsService.findLocationBy( term, 'company');
  }

  @Get('with-movements/:term') // localhost:3000/api/locations/with-movements/:term - GET
  findLocationWithMovements(
    @Param( 'term' ) term: string
  ) {
    return this.locationsService.findLocationBy( term, 'movements');
  }

  @Patch(':id') // localhost:3000/api/locations/:id - PATCH
  updateLocation(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return this.locationsService.updateLocation( id, updateLocationDto );
  }

  @Delete(':id') // localhost:3000/api/locations/:id - DELETE
  deleteLocation(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.locationsService.deleteLocation( id );
  }
}
