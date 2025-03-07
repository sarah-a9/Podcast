import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';

// export type EpisodeDocument = Episode & Document;

export enum Episodestatus{
    DRAFT = 'draft',
    PUBLISHED = 'published',
    SCHEDULED = 'scheduled',
    REPORTED = 'reported',
    ARCHIVED = 'archived',
}

@Schema({timestamps: true})
export class Episode extends Document{

    @Prop({required:true})
    episodeTitle: string;

    @Prop({required:true})
    episodeDescription: string;

    @Prop({required:true})
    audioUrl: string;

    @Prop({type: Types.ObjectId, ref:'Podcast', required:true})
    podcast: Types.ObjectId;

    @Prop({enum: Episodestatus, default:Episodestatus.DRAFT})
    status: Episodestatus;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);