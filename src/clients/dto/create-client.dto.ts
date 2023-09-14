import { IsEmail, IsString, MinLength } from "class-validator";


export class CreateClientDto {
    
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
}
