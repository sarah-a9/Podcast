import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User{
    @Prop({required: true})
    firstName: String; 

    @Prop({required: true})
    lastName: String;

    @Prop({required: true, unique:true})
    email: String;

    @Prop({required: true, unique:true})
    password: String;

    @Prop({default:''})
    bio: String;

    @Prop({default:''})
    profilePic: String;

    @Prop({enum:[0,1], default:1}) //user est de role 1 et admin est de role 0
    role: number;

}

export const UserSchema = SchemaFactory.createForClass(User);