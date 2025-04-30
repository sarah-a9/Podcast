// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendVerificationEmail({ to, token }: { to: string; token: string }) {
    const verifyUrl = `http://localhost:3001/verify-email?token=${token}`;
  
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bienvenue sur notre plateforme !</h2>
        <p>Merci de t'être inscrit. Pour finaliser ton inscription, clique sur le bouton ci-dessous :</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          Vérifier mon adresse email
        </a>
        <p style="margin-top: 20px;">Si tu n'es pas à l'origine de cette inscription, tu peux ignorer cet email.</p>
      </div>
    `;
  
    await this.resend.emails.send({
      from: 'Sarah <onboarding@resend.dev>',
      to,
      subject: 'Vérifie ton adresse email',
      html: htmlContent,
    });
  }

  async sendResetPasswordEmail({ to, token }: { to: string; token: string }) {
    const resetUrl = `http://localhost:3001/auth/resetPassword?token=${token}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Réinitialisation de ton mot de passe</h2>
        <p>Clique sur le bouton ci-dessous pour réinitialiser ton mot de passe :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
          Réinitialiser mon mot de passe
        </a>
        <p style="margin-top: 20px;">Ce lien est valable pendant 1 heure.</p>
      </div>
    `;
  
    await this.resend.emails.send({
      from: 'Sarah <onboarding@resend.dev>',
      to,
      subject: 'Réinitialise ton mot de passe',
      html: htmlContent,
    });
  }
  
  
}
