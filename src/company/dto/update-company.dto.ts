import { IsString, MinLength } from "class-validator";


export class UpdateCompanyDto {

    @IsString()
    @MinLength(1)  
    companyName?: string;

    @IsString()
    @MinLength(10)  
    phoneNumber?: string;

    @IsString()
    @MinLength(1)  
    address?: string;

    @IsString()
    @MinLength(1)  
    www?: string;

}
