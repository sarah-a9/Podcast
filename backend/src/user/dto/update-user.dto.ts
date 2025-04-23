import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

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
    
        
        
}
