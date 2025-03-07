import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
// import { ResetToken } from '../schemas/reset-token.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
        // @InjectModel(ResetToken.name) private ResetTokenModel : Model<ResetToken>,

        private jwtService: JwtService){}

    async signup(signupData: SignupDto){
        const {firstName, lastName, email, password} = signupData;
        
        //check if email already is used
        const emailInUse = await this.UserModel.findOne({email})
        if(emailInUse){
            throw new BadRequestException("Email already used");
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user document and save in mongodb
        await this.UserModel.create({
            firstName,
            lastName,
            email,
            password : hashedPassword, 
        })
    }

    async login(credentials: LoginDto){
        const { email, password} = credentials;

        //find if user exists by email 
        const user = await this.UserModel.findOne({ email })
        if(!user){
            throw new UnauthorizedException("wrong credentials")
        }

        //compare entered password with existing password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            throw new UnauthorizedException("Wrong credentials")
        }

        //generate JWT Tokens
        const tokens = await this.generateUserToken(user._id)
        return {
            ...tokens,
            userId: user._id
        }
    }

    async changePassword(userId, oldPassword:string, newPassword:string){
        //find the user
        const user = await this.UserModel.findById(userId)
        if(!user){
            throw new NotFoundException('User not found...')
        }

        //compare the old password (inserted) with the password in database
        const passwordMatch = await bcrypt.compare(oldPassword, user.password)
        if(!passwordMatch){
            throw new UnauthorizedException('Wrong credentials')
        }

        //change user's password and hash it
        const newHashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = newHashedPassword
        await user.save() 
    }

    // async forgotPassword(email: string){
    //     //check that user exists
    //     const user = await this.UserModel.findOne({email})
    //     if(user){
    //         const expiryDate = new Date()
    //         expiryDate.setHours(expiryDate.getHours() + 1)
    //         //if user exists, generate password reset link
    //         const resetToken = nanoid(64)
    //         await this.ResetTokenModel.create({
    //             token: resetToken,
    //             userId: user._id,
    //             expiryDate
    //         })
    //         //send the link to the user by email

    //     }
    //     return {Message: "if this user exists, they will recieve an email"}
    // }

    async refreshTokens(refreshToken: string){
        const token = await this.RefreshTokenModel.findOneAndDelete({
            token: refreshToken,
            expiryDate: {$gte: new Date()}
        })

        if(!token){
             throw new UnauthorizedException("refresh Token is invalid")
        }

         // Generate new tokens
        const newTokens = await this.generateUserToken(token.userId)

        // Fetch user info
        const user = await this.UserModel.findById(token.userId).select("-password")

        return{
            ...newTokens,
            user
        }

    }

    async generateUserToken(userId){
        const accessToken = this.jwtService.sign({userId}, {expiresIn: '1d'});
        const refreshToken = uuidv4();
        await this.storeRefreshToken(refreshToken, userId)
        return {
            accessToken,
            refreshToken
        }
    }

    async storeRefreshToken(token: string, userId){

        //calculate expiry date 3 days from now 
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3)

        await this.RefreshTokenModel.create({token, userId, expiryDate})
    }
}
