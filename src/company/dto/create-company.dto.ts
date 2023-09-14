import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateCompanyDto {

    @IsString()
    @MinLength(1)  
    companyName: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+/, {
        message: 'The password must have an uppercase letter, lowercase letter, and a number'
    })
    password: string;

    @IsString()
    @MinLength(10)  
    phoneNumber: string;

    @IsString()
    @MinLength(1)  
    address: string;

    @IsString()
    @MinLength(1)  
    www: string;

}
