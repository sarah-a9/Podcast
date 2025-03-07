import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({versionKey: false, timestamps: true})
export class RefreshToken extends Document{

    @Prop({required: true})
    token: string;

    @Prop({type: Types.ObjectId, ref:'User', required:true}) //Un Token appartient à un seul utilisateur
    userId: Types.ObjectId;

    @Prop({required: true})
    expiryDate: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)