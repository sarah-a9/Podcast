import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Document } from 'mongoose';

// export type PlaylistDocument = Playlist & Document ;

@Schema()
export class Playlist extends Document{

    @Prop({required: true})
    playlistName : string;

    @Prop()
    playlistDescription : string;

    @Prop()
    playlistImg : string ;

    @Prop({type : [{type: Types.ObjectId, ref:"Episode"}] }) //une playlist est composée de plusieurs episodes
    Episodes: Types.ObjectId[];

    @Prop({type : Types.ObjectId , ref:"User" , required:true})
    user : Types.ObjectId;
    


}
export const PlaylistSchema = SchemaFactory.createForClass(Playlist);