import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/User.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from '../schemas/refresh-token.schema';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { ResetToken, ResetTokenSchema } from '../schemas/reset-token.schema';
import { JwtModule } from '@nestjs/jwt';
// import { ResetToken, ResetTokenSchema } from '../schemas/reset-token.schema';

@Module({
  imports: [
    JwtModule.register({
       secret: process.env.JWT_SECRET || 'secret_key', 
      //  signOptions: { expiresIn: '1h' },
     }),
    MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: RefreshToken.name, schema: RefreshTokenSchema },
    { name: ResetToken.name, schema: ResetTokenSchema }
  ]),forwardRef(()=> UserModule) ,
  EmailModule ,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
