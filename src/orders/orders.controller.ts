import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { PaginationDto } from 'src/common/dtos';

@Controller('orders') // localhost:3000/api/orders

export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) {}

  @Post() // localhost:3000/api/orders - POST
  createOrder(
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.createOrder( createOrderDto );
  }

  @Get('/:id') // localhost:3000/api/orders/:id - GET
  findAllOrders(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.ordersService.findAllOrders( id, paginationDto );
  }

  @Get('plained/:term') // localhost:3000/api/orders/plained/:term - GET
  findOrderPlained(
    @Param( 'term' ) term: string
  ) {
    return this.ordersService.findOrderBy( term );
  }

  @Get('with-products/:term') // localhost:3000/api/orders/with-products/:term - GET
  findOrderWithProducts(
    @Param( 'term' ) term: string
  ) {
    return this.ordersService.findOrderBy( term, "products");
  }

  @Get('with-company/:term') // localhost:3000/api/orders/with-company/:term - GET
  findOrderWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.ordersService.findOrderBy( term, "company");
  }

  @Get('with-client/:term') // localhost:3000/api/orders/with-client/:term - GET
  findOrderWithClient(
    @Param( 'term' ) term: string
  ) {
    return this.ordersService.findOrderBy( term, "client");
  }

  @Get('complete/:term') // localhost:3000/api/orders/complete/:term - GET
  findOrderComplete(
    @Param( 'term' ) term: string
  ) {
    return this.ordersService.findOrderBy( term, "complete");
  }

  //No buscamos esta funcionalidad por ahora - puede implementarse en el futuro
  @Patch(':id') // localhost:3000/api/orders/:id - PATCH
  updateOrder(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.updateOrder( id, updateOrderDto );
  }
}
