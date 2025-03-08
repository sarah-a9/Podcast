import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';

// export type PlaylistDocument = Playlist & Document ;

@Schema()
export class Playlist extends Document{

    @Prop({required: true , unique:true})
    playlistName : string;

    @Prop({ type: String, default: '' })
    playlistDescription : string;

    @Prop()
    playlistImg : string ;

    @Prop({type : [{type: Types.ObjectId, ref:"Episode"}], default: [] }) //une playlist est composée de plusieurs episodes
    episodes: Types.ObjectId[];

    @Prop({type : Types.ObjectId , ref:"User" , required:true})
    creator : Types.ObjectId;
    


}
export const PlaylistSchema = SchemaFactory.createForClass(Playlist);