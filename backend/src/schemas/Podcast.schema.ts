import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';

// export type PodcastDocument = Podcast & Document;

@Schema({ timestamps: true })
export class Podcast extends Document{

    @Prop({required : true , unique: true})
    podcastName: string;

    @Prop({required : true})
    podcastDescription: string;

    @Prop({required : true})
    podcastImage: string;

    @Prop({type: [{type: Types.ObjectId, ref:'Category'}]}) // Un podcast peut avoir plusieurs catégories
    categories: Types.ObjectId[];

    @Prop({type: Types.ObjectId, ref:'User', required:true}) //Un podcast appartient à un seul utilisateur aka creator et un creatur peut avoir plusieurs podcasts
    creator: Types.ObjectId;
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);
