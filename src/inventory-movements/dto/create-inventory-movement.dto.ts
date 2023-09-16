import { IsArray, IsString, IsUUID } from "class-validator";


export class CreateInventoryMovementDto {

    @IsString()
    inventoryMovementType: 'entrance' | 'exit' | 'transfer' | 'devolution';

    @IsArray()
    productsIds: string[]; 

    @IsString()
    @IsUUID("4")
    sourceLocation: string;

    @IsUUID('4')
    @IsString()
    idCompany: string;

    @IsString()
    @IsUUID("4")
    destinationLocation: string;
}
