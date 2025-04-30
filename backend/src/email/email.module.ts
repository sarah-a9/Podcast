// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // pour accéder à process.env
  providers: [EmailService],
  exports: [EmailService], // très important : rend le service utilisable ailleurs (ex: AuthService)
})
export class EmailModule {}
