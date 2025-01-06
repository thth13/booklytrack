import { Document, Types } from 'mongoose';

export interface User extends Document {
  login: string;
  email: string;
  password: string;
  loginAttempts?: number;
  blockExpires?: Date;
}
