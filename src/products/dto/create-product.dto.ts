import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from 'class-validator';


export class CreateProductDto {

    @IsUUID('4')
    @IsString()
    idCompany: string;

    @IsUUID('4')
    @IsString()
    idSupplier: string;

    @IsUUID('4')
    @IsString()
    idLocation: string;

    
    @IsString()
    @MinLength(1)  
    title: string;

    @IsString()
    @MinLength(1)  
    description: string;

    @IsNumber()
    @Min(0)
    @IsPositive() 
    unitPrice: number;

    @IsInt() 
    @Min(0)
    @IsPositive() 
    currentStock: number;

    @IsInt() 
    @IsOptional()
    @Min(1)
    @IsPositive() 
    minimumStock?: number;

    @IsString()
    @MinLength(1)  
    category: string;
}
