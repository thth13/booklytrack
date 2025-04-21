import { Document } from 'mongoose';

export interface Book extends Document {
  _id: { type: String };
  title: string;
  description: string;
  authors: string[];
  cover: string;
  googleId: string;
  categories: string[];
  publisher: string;
  publishedDate: Date;
}
