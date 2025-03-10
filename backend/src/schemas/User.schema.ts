import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Podcast } from "./Podcast.schema";

// export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: '' })
    bio: string;

    @Prop({ default: '' })
    profilePic: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: "Podcast" }], default: [] })
    podcasts: Types.ObjectId[]; // 🔥 Reference to podcasts

    @Prop({ type: [{ type: Types.ObjectId, ref: "Playlist" }], default: [] })
    playlists: Types.ObjectId[]; // 🔥 Reference to playlists

    @Prop({ enum: [0, 1], default: 1 }) // user is role 1 and admin is role 0
    role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

