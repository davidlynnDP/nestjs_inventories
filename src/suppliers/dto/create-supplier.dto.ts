import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {

    @IsString()
    @MinLength(1)  
    fullName: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(10)  
    phoneNumber: string;

    @IsString()
    @MinLength(1)  
    address: string;

    @IsString()
    @MinLength(1)  
    www: string;
}
