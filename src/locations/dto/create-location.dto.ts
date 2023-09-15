import { IsString, IsUUID, MinLength } from 'class-validator';


export class CreateLocationDto {


    @IsString()
    @IsUUID('4')
    idCompany: string; 
    
    @IsString()
    @MinLength(1)  
    locationName: string;

    @IsString()
    @MinLength(1)  
    locationAddress: string;
}
