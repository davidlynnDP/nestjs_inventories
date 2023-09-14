import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator';


export class UpdateProductDto {


    @IsOptional()
    @IsString()
    @MinLength(1)  
    title?: string;

    @IsOptional()
    @IsString()
    @MinLength(1)  
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @IsPositive() 
    unitPrice?: number;

    @IsOptional()
    @IsInt() 
    @Min(0)
    @IsPositive() 
    currentStock?: number;

    @IsInt() 
    @IsOptional()
    @Min(1)
    @IsPositive() 
    minimumStock?: number;

    @IsOptional()
    @IsString()
    @MinLength(1)  
    category?: string;
}
