import { IsArray, IsString } from "class-validator";


export class DeleteFilesDto {

    @IsArray()
    secureUrls: string[]
}