import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { UploadApiErrorResponse } from 'cloudinary';

import { DatabaseErrorsTypes } from './interfaces';
import { ErrorCodes } from './enums';
import { CloudinaryResponse } from 'src/cloudinary/types';


@Injectable()
export class CommonService {

  private readonly logger = new Logger('CommonService');

  constructor( 

    /* dependencias */
    
  ) {}

  errorHandler( error: DatabaseErrorsTypes ): never {

    console.log( error )
    this.logger.error( error );

    switch ( error.code ) {
        case ErrorCodes.duplicatedKey:  
          throw new BadRequestException(`${ error.detail.replace('Key ','') } - table ${ error.table }`);
          //*NotFoundException

        default:
            throw new InternalServerErrorException('Unexpected error, check the server logs!'); 
        }
    }

  cloudinaryMultipleResponseErrorHandling( responseFromCloudinary: CloudinaryResponse[] ): boolean {

      const hasError = responseFromCloudinary.some( response  => {
        const isApiErrorResponse = response as  UploadApiErrorResponse;
        const hasRequiredProperties: boolean = response.message && response.name && response.http_code;
        return isApiErrorResponse && hasRequiredProperties;
      });

      return hasError;
  }

  cloudinarySingleResponseErrorHandling( responseFromCloudinary: CloudinaryResponse ): boolean {

    const isApiErrorResponse = responseFromCloudinary as UploadApiErrorResponse;
    const hasRequiredProperties: boolean = responseFromCloudinary.message && responseFromCloudinary.name && responseFromCloudinary.http_code;
    return isApiErrorResponse && hasRequiredProperties;
  }

}
