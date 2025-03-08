import { Body, Controller, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshTokens.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    //POST Method for Signup
    @Post('signup')
    async signup(@Body() signupData: SignupDto){
        return this.authService.signup(signupData)
    }

    //POST Method for Login
    @Post('login')
    async login(@Body() credentials: LoginDto){
        return this.authService.login(credentials)
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    //POST Method for Changing Password 
    @UseGuards(AuthGuard)
    @Put('changePassword')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req){
        return this.authService.changePassword(
            req.userId,
            changePasswordDto.oldPassword,
            changePasswordDto.newPassword
        );
    }

    // //POST Method for Forgetting Password
    // @Post('forgotPassword')
    // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    //     return this.authService.forgotPassword(forgotPasswordDto.email)
    // }

    //POST Method for Resetting Password
}
