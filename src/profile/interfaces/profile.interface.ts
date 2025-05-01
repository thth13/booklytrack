import { Document, Types } from 'mongoose';

export interface Profile extends Document {
  name: string;
  avatar: string;
  description: string;
  views: number;
  user: Types.ObjectId;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  reading: Types.ObjectId[];
  finished: Types.ObjectId[];
  wantsToRead: Types.ObjectId[];
}
