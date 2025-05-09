import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

        @IsString()
        @IsNotEmpty()
        firstName: string; 
    
        @IsString()
        @IsNotEmpty()
        lastName: string;
    
        @IsString()
        @IsNotEmpty()
        @IsOptional()
        email: string;
    
        @IsString()
        @MinLength(6)
        @IsOptional()
        password: string;
    
        @IsString()
        @IsOptional()
        bio?: string;
    
        @IsString()
        @IsOptional()
        profilePic?: string;
    
        @IsOptional()
        @IsEnum([0, 1]) // Restrict values to 0 (admin) or 1 (user)
        role?: number;

}


