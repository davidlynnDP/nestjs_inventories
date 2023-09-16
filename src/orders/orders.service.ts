import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid'; 

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities';
import { CommonService } from 'src/common/common.service';
import { ClientsService } from 'src/clients/clients.service';
import { ProductsService } from 'src/products/products.service';
import { CompanyService } from 'src/company/company.service';
import { PaginationDto } from 'src/common/dtos';
import { Product } from 'src/products/entities';

type OptionsFindOrderBy = "flattened" | "products" | "company" | "client" | "complete";

interface ProductsWithQuantity extends Product {
  quantity: number;
}

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>, 

    private readonly companyService: CompanyService, 

    private readonly productsService: ProductsService,
    
    private readonly clientsService: ClientsService, 

    private readonly commonService: CommonService,
  ) {}

  async createOrder( createOrderDto: CreateOrderDto ) {
    const { idClient, idCompany, orderCart, tax:tx } = createOrderDto;

    const company = await this.companyService.findCompanyByTerm( idCompany );
    const client = await this.clientsService.findClientByTerm( idClient );

    const productPromises = [];

    orderCart.forEach( ({ productId, quantity }) => {
      productPromises.push( this.productsService.findProductByTerm( productId ), quantity );
    });

    const productsWithQuantity: ProductsWithQuantity[] = await Promise.all( productPromises );
    
    const numberOfItems = productsWithQuantity.reduce( ( prev, current ) => current.quantity + prev , 0 );  
    const subTotal = productsWithQuantity.reduce( ( prev, current ) => (current.unitPrice * current.quantity) + prev, 0 );
    const taxRate = !!tx ? tx : 0 

    const orderSummary = {
        numberOfItems,
        subTotal,
        tax: subTotal * taxRate,
        total: subTotal + taxRate  
    }

    try {
      
      const order = this.orderRepository.create({ 
        client,
        company,
        productsIncludedOnOrder: productsWithQuantity.map( ({ quantity, ...aboutProduct }) => aboutProduct as Product ),
        quantityProductsIncludedOnOrder: orderSummary.numberOfItems,
        subtotal: orderSummary.subTotal,
        tax: orderSummary.tax,
        total: orderSummary.total
      });

      for ( const productWithQuantity of productsWithQuantity ) {
        const product = await this.productsService.findProductByTerm( productWithQuantity.id );
        product.currentStock -= productWithQuantity.quantity;
        const { company, supplier, images, location, movement, orders, id, code, category, ...aboutProduct } = product;
        await this.productsService.updateProduct( product.id, aboutProduct );
      }
      
      return await this.orderRepository.save( order );  

    } catch ( error ) {
      this.commonService.errorHandler( error );
    }
    
  }

  async findAllOrders( id: string, paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    const company = await this.companyService.findCompanyByTerm( id )

    const orders = await this.orderRepository.find({
      take: limit,   
      skip: offset,  
      where: {
        company: {
          id: company.id
        }
      }
    })

    return orders.map( ({ client, company, productsIncludedOnOrder, ...aboutOrder }) => ({
      ...aboutOrder
    }))
  }

  async findOrderByTerm( id: string ): Promise<Order> {

    let order: Order;

    if ( isUUID( id ) )
      order = await this.orderRepository.findOneBy({ id });

    if ( !order ) 
      throw new NotFoundException(`Order with id: ${ id } not found`); 

    return order;
  }

  async findOrderBy( id: string, options: OptionsFindOrderBy = 'flattened' ) {

    switch ( options ) {
      case 'products':
        return await this.findOrderWithProducts( id );
      case 'company':
        return await this.findOrderWithCompany( id );
      case 'client':
        return await this.findOrderWithClient( id );
      case 'complete':
        return await this.findOrderComplete( id );
      default:
        return await this.findOrderPlained( id );
    }

  }

  async findOrderPlained( id: string ) {

    const order = await this.findOrderByTerm( id );
    const { client, company, productsIncludedOnOrder, ...aboutOrder } = order;

    return {
      ...aboutOrder,
    }
  }

  async findOrderWithProducts( id: string ) {

    const order = await this.findOrderByTerm( id );
    const { client, company, productsIncludedOnOrder, ...aboutOrder } = order;

    return {
      ...aboutOrder,
      products: productsIncludedOnOrder
    }
  }

  async findOrderWithCompany( id: string ) {

    const order = await this.findOrderByTerm( id );
    const { client, company, productsIncludedOnOrder, ...aboutOrder } = order;

    return {
      ...aboutOrder,
      company
    }
  }

  async findOrderWithClient( id: string ) {

    const order = await this.findOrderByTerm( id );
    const { client, company, productsIncludedOnOrder, ...aboutOrder } = order;

    return {
      ...aboutOrder,
      client
    }
  }

  async findOrderComplete( id: string ) {

    const order = await this.findOrderByTerm( id );

    return {
      ...order
    }
  }

  //No buscamos esta funcionalidad por ahora
  async updateOrder( id: string, updateOrderDto: UpdateOrderDto ) {
    
  }

  async deleteAllOrders() {

    const query = this.orderRepository.createQueryBuilder('order'); 

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
