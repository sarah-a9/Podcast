import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto{

    @IsString()
    oldPassword: string

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, {message: 'password must contain at least one number' })
    newPassword: string

}