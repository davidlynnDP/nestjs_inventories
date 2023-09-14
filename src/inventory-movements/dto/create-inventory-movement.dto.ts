import { IsEnum } from "class-validator";
import { TypesOfInventoryMovement } from "../enums";


export class CreateInventoryMovementDto {

    @IsEnum(TypesOfInventoryMovement)
    inventoryMovementType: TypesOfInventoryMovement;
}
