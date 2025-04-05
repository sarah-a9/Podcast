import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

// export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document{

    @Prop({required:true, unique:true})
    categoryName: string;

    @Prop({type : [{type : Types.ObjectId , ref:"Podcast"}], defaults:[]})
    listePodcasts:Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;