// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import mongoose, { Types } from "mongoose";

// @Schema({versionKey: false, timestamps: true})
// export class ResetToken extends Document{

//     @Prop({required:true})
//     token: string

//     @Prop({type: Types.ObjectId, ref:'User', required:true}) //Un Token appartient à un seul utilisateur
//     userId: Types.ObjectId;

//     @Prop({required:true})
//     expiryDate: Date
// }
// export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken)