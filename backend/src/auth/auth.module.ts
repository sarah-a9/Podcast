import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/User.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenSchema } from '../schemas/refresh-token.schema';
// import { ResetToken, ResetTokenSchema } from '../schemas/reset-token.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: RefreshToken.name, schema: RefreshTokenSchema },
    // { name: ResetToken.name, schema: ResetTokenSchema }
  ])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
