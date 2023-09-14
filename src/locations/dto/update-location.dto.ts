import { IsString, MinLength } from "class-validator";


export class UpdateLocationDto {

    @IsString()
    @MinLength(1)  
    locationName?: string;

    @IsString()
    @MinLength(1)  
    locationAddress?: string;
}
