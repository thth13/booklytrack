import { Document, Types } from 'mongoose';

export interface Profile extends Document {
  fullName: string;
  avatar: string;
  description: string;
  views: number;
  user: [Types.ObjectId];
  following: [Types.ObjectId];
  followers: [Types.ObjectId];
  read: [Types.ObjectId];
  reads: [Types.ObjectId];
  wantsToRead: [Types.ObjectId];
}
