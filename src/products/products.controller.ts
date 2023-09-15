import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { CreateProductDto, UpdateProductDto, DeleteFileDto, DeleteFilesDto } from './dto';
import { ProductsService } from './products.service';
import { ProductImagesService } from './product-images.service';
import { ProductCategoriesService } from './product-categories.service';
import { PaginationDto } from 'src/common/dtos';


@Controller('products') // localhost:3000/api/products
export class ProductsController {
  
  constructor(
    private readonly productsService: ProductsService,

    private readonly productImagesService: ProductImagesService, 

    private readonly productCategoriesService: ProductCategoriesService, 
  ) {}

  @Post() // localhost:3000/api/products - POST
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsService.createProduct( createProductDto );
  }

  @Get('/:id') // localhost:3000/api/products/:id - GET
  findAllProducts(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.productsService.findAllProducts( id, paginationDto );
  }

  //! corregir
  @Get('plained/:term') // localhost:3000/api/products/plained/:term - GET
  findProductPlained(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Get('with-category-and-images/:term') // localhost:3000/api/products/with-category-and-images/:term - GET
  findProductWithCategoryAndImages(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Get('with-company/:term') // localhost:3000/api/products/with-company/:term - GET
  findProductWithCompany(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Get('with-supplier/:term') // localhost:3000/api/products/with-supplier/:term - GET
  findProductWithSupplier(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Get('with-locations/:term') // localhost:3000/api/products/with-locations/:term - GET
  findProductWithLocations(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Get('with-movements/:term') // localhost:3000/api/products/with-movements/:term - GET
  findProductWithMovements(
    @Param( 'term' ) term: string
  ) {
    return this.productsService.findProductByTermPlained( term );
  }

  @Patch(':id') // localhost:3000/api/products/:id - PATCH
  updateProduct(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.updateProduct( id, updateProductDto );
  }

  @Delete(':id') // localhost:3000/api/products/:id - DELETE
  deleteProduct(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.productsService.deleteProduct( id );
  }

  //* images?

  @Post('file/:id')  // localhost:3000/api/products/file/:id - POST
  @UseInterceptors( FileInterceptor('file') )
  uploadSingleProductImage( 
    @Param('id', ParseUUIDPipe ) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
          new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
        ]
      }),
    ) file: Express.Multer.File,   
  ) {
    return this.productImagesService.createProductWithSingleImage( id, file );
  } 

  @Post('files/:id')  // localhost:3000/api/products/files/:id - POST
  @UseInterceptors( FilesInterceptor('file[]', 5) )
  uploadMultipleProductImages( 
    @Param('id', ParseUUIDPipe ) id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // 4 megabytes
          new FileTypeValidator({ fileType: '.(jpg|png|jpeg)' }), // extensions
        ]
      }),
    ) files: Express.Multer.File[],   
  ) {
    return this.productImagesService.createProductWithMultipleImages( id, files );
  } 

  @Delete('files/delete-file') // localhost:3000/api/products/files/delete-file - DELETE
  deleteSingleImageBySecureURL(
    @Body() deleteFileDto: DeleteFileDto
  ) {
    return this.productImagesService.deleteSingleImage( deleteFileDto );
  }

  @Delete('files/delete-files') // localhost:3000/api/products/files/delete-files - DELETE
  deleteMultipleImagesBySecureURLs(
    @Body() deleteFilesDto: DeleteFilesDto
  ) {
    return this.productImagesService.deleteMultipleImages( deleteFilesDto );
  }

  @Get('files/by-id/:id') // localhost:3000/api/products/files/by-id/:id - GET
  findImageById(
    @Param('id', ParseUUIDPipe ) id: string,
  ) {
    return this.productImagesService.findImageBySecureUrl( id );
  }

  @Get('files/by-secure-url') // localhost:3000/api/products/files/by-secure-url - GET
  findImageByUrl(
    @Body() deleteFileDto: DeleteFileDto
  ) {
    const { secureUrl } = deleteFileDto;
    return this.productImagesService.findImageBySecureUrl( secureUrl );
  }

  @Get('files/all/:id') // localhost:3000/api/products/files/all/:id - GET
  findAllImagesOfProduct(
    @Param('id', ParseUUIDPipe ) id: string, //idProduct
    @Query() paginationDto: PaginationDto
  ) {
    return this.productImagesService.findAllImages( id, paginationDto );
  }

  //* categories
  @Get('categories/all/:id') // localhost:3000/api/products/categories/all/:id - GET
  findAllCategories(
    @Param('id', ParseUUIDPipe ) id: string, //idCompany
    @Query() paginationDto: PaginationDto
  ) {
    return this.productCategoriesService.findAllCategories( id, paginationDto );
  }
}
