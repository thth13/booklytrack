import { Document, Types } from 'mongoose';

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  expires: Date;
  loginAttempts?: number;
  blockExpires?: Date;
  following: [Types.ObjectId];
  followers: [Types.ObjectId];
  read: [Types.ObjectId];
  reads: [Types.ObjectId];
  wantsToRead: [Types.ObjectId];
}
