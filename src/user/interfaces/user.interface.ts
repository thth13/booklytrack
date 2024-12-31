import { Document, Types } from 'mongoose';

export interface User extends Document {
  login: string;
  email: string;
  password: string;
  expires: Date;
  loginAttempts?: number;
  blockExpires?: Date;
}
