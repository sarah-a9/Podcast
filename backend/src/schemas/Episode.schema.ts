import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

// export type EpisodeDocument = Episode & Document;

export enum Episodestatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  REPORTED = 'reported',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Episode extends Document {
  @Prop({ required: true, unique: false, sparse: true })
  episodeTitle: string;

  @Prop({ required: true })
  episodeDescription: string;

  @Prop({ required: false, unique: false, sparse: true })
  audioUrl?: string;

  @Prop({ type: Date, required: false })
  scheduledAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Podcast', required: true })
  podcast: Types.ObjectId;

  @Prop({ enum: Episodestatus, default: Episodestatus.DRAFT })
  status: Episodestatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Playlist' }], default: [] })
  playlists: Types.ObjectId[];

  @Prop({ default: 0 })
  listens: number;

  //  Array of users who liked this episode
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedByUsers: Types.ObjectId[];

  // ⭐️ Ratings: array of { user, value }
  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    default: [],
  })
  ratings: { user: Types.ObjectId; value: number }[];

  @Prop({ type: Number, default: 0 })
  averageRating: number;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
export type EpisodeDocument = Episode & Document;
