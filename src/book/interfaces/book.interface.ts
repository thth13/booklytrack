import { Document } from 'mongoose';

export interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface Book extends Document {
  googleId: string;
  title: string;
  description: string;
  authors: string[];
  imageLinks: ImageLinks;
  categories: string[];
  publisher: string;
  publishedDate: Date;
  pageCount: number;
  language: string;
}
