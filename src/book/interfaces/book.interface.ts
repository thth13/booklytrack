import { Document } from 'mongoose';

export interface Book extends Document {
  title: string;
  description: string;
  author: string;
  cover: string;
  isbn: string;
}
