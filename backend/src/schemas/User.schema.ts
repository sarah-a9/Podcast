import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

// export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document{
    @Prop({required: true})
    firstName: string; 

    @Prop({required: true})
    lastName: string;

    @Prop({required: true, unique:true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({default:''})
    bio: string;

    @Prop({default:''})
    profilePic: string;

    @Prop({enum:[0,1], default:1}) //user est de role 1 et admin est de role 0
    role: number;

}

export const UserSchema = SchemaFactory.createForClass(User);