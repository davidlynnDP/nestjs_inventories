import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';



@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) {}


  async populateDatabase(): Promise<string> {


    return 'SEED EXECUTED';
  }
}
