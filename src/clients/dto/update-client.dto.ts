import { IsString, MinLength } from "class-validator";


export class UpdateClientDto {

    @IsString()
    @MinLength(1)  
    fullName?: string;

    @IsString()
    @MinLength(10)  
    phoneNumber?: string;

    @IsString()
    @MinLength(1)  
    address?: string;
}
