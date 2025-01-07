import { Document, Types } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';

export interface Profile extends Document {
  fullName: string;
  avatar: string;
  description: string;
  views: number;
  user: User;
  following: User;
  followers: User;
  read: [Types.ObjectId];
  reads: [Types.ObjectId];
  wantsToRead: [Types.ObjectId];
}
