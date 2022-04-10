import {IsNotEmpty, IsDefined, IsEmail} from 'class-validator';

export class AuthDto {
    @IsDefined()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsDefined()
    @IsNotEmpty()
    readonly password: number;
}
