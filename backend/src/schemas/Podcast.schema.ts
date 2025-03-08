import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';
import { User } from "./User.schema";

// export type PodcastDocument = Podcast & Document;

@Schema({ timestamps: true })
export class Podcast extends Document{

    @Prop({required : true , unique: true})
    podcastName: string;

    @Prop({required : true})
    podcastDescription: string;

    @Prop({required : true})
    podcastImage: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }], required : true  ,default: [] }) // Un podcast peut avoir plusieurs catégories
    categories: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    creator: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Episode' }], default: [] })// Un podcast peut avoir plusieurs episodes
    episodes : Types.ObjectId[];

    @Prop({ default: 0 })
    likes: number;
  
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);
export type PodcastDocument = Podcast & Document;

