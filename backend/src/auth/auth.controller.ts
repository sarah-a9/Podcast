import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshTokens.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { UserService } from '../user/user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, 
                private userService: UserService,
    ){}

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

    
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Request() req) {
    // req.userId is populated by the AuthGuard upon token verification.
    return this.authService.logout(req.userId);
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

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('me')
    async getCurrentUser(@Request() req) {
        // req.userId is set in the AuthGuard after verifying the token.
        const user = await this.userService.findOne(req.userId);
        if (!user) {
        throw new Error('User not found');
        }
        return user;
    }

    // //POST Method for Forgetting Password
    // @Post('forgotPassword')
    // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    //     return this.authService.forgotPassword(forgotPasswordDto.email)
    // }

    //POST Method for Resetting Password
}
