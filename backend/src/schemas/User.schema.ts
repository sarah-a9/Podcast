import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Podcast } from './Podcast.schema';

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

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Podcast' }], default: [] })
  podcasts: Types.ObjectId[]; // 🔥 Reference to podcasts

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Playlist' }], default: [] })
  playlists: Types.ObjectId[]; // 🔥 Reference to playlists

  @Prop({ enum: [0, 1], default: 1 }) // user is role 1 and admin is role 0
  role: number;

  // Array of episodes that the user has liked
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Episode' }], default: [] })
  likedEpisodes: Types.ObjectId[]; // Reference to liked episodes

  // Array of Podcasts that the user has put to favorite
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Podcast' }], defaults: [] })
  favoritePodcasts: Types.ObjectId[]; // Reference to favorite podcasts

  //Array of episodes that the user has rated
  @Prop({
    type: [
      {
        episode: { type: Types.ObjectId, ref: 'Episode' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    default: [],
  })
  ratings: { episode: Types.ObjectId; value: number }[];

  //Array of the users that the user is following
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  following: Types.ObjectId[];

  //Array of the users that are following the user
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  followers: Types.ObjectId[];



}






export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
