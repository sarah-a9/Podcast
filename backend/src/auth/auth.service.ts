import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import { ResetToken } from '../schemas/reset-token.schema';
// import { ResetToken } from '../schemas/reset-token.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
        @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
        
        private jwtService: JwtService,
        private emailService: EmailService
    ){}

    async signup(signupData: SignupDto){
        const {firstName, lastName, email, password} = signupData;
        
        //check if email already is used
        const emailInUse = await this.UserModel.findOne({email})
        if(emailInUse){
            throw new BadRequestException("Email already used");
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = randomBytes(32).toString('hex'); // ou nanoid()

        //create user document and save in mongodb
        await this.UserModel.create({
            firstName,
            lastName,
            email,
            password : hashedPassword, 
            emailVerificationToken,
        });

        // const verificationUrl = `http://localhost:3000/auth/verify-email?token=${emailVerificationToken}`;
        await this.emailService.sendVerificationEmail({ 
            to: email, 
            token: emailVerificationToken });

        
          return { message: 'User created, verification email sent.' };
        
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
        // Instead of userId, use 'sub'
        const token = this.jwtService.sign({ sub: (user._id as Types.ObjectId).toString() });
        return {
            token,
            user: {
                userId: user._id,
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                password: user.password, 
                picture:user.profilePic, 
                bio: user.bio,
            },
        }
    }


    async logout(userId: string): Promise<{ message: string }> {
        // Invalidate refresh tokens by deleting them from the database
        await this.RefreshTokenModel.deleteMany({ userId });
        return { message: 'Logout successful' };
    }


    async verifyEmail(token: string) {
        const user = await this.UserModel.findOne({ emailVerificationToken: token });
      
        if (!user) {
          throw new NotFoundException('Token de vérification invalide ou expiré');
        }
      
        if (user.isEmailVerified) {
          return { message: 'Adresse email déjà vérifiée' };
        }
      
        user.isEmailVerified = true;
        user.emailVerificationToken = ""; // ou supprimer le champ
        const savedUser = await user.save();
        console.log(savedUser);
        return { message: 'Adresse email vérifiée avec succès' };
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

    async forgotPassword(email: string) {
        const user = await this.UserModel.findOne({ email });
        if (!user) return { message: 'If this user exists, an email will be sent.' };
      
        const token = uuidv4();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // 1 heure valide
      
        await this.ResetTokenModel.create({
          token,
          userId: user._id,
          expiryDate,
        });
      
        await this.emailService.sendResetPasswordEmail({ to: email, token });
        return { message: 'Reset password email sent' };
      }
      

      async resetPassword(token: string, newPassword: string) {
        const resetToken = await this.ResetTokenModel.findOne({ token });
        if (!resetToken || resetToken.expiryDate < new Date()) {
          throw new BadRequestException('Token is invalid or expired');
        }
      
        const user = await this.UserModel.findById(resetToken.userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
      
        await this.ResetTokenModel.deleteOne({ _id: resetToken._id }); // facultatif
        return { message: 'Password has been reset' };
      }
      

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
        const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '1d' });
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
