import { IsInt, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';


interface OrderCartInformation {
    productId: string; 
    quantity: number;
}

export class CreateOrderDto {

    orderCart: OrderCartInformation[]; 

    @IsString()
    @IsUUID("4")
    idClient: string;

    @IsUUID('4')
    @IsString()
    idCompany: string;


    @IsInt()
    @IsPositive()
    @IsOptional()
    tax?: number; //0.15 = 15%
}
