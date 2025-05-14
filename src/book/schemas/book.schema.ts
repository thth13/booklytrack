import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ImageLinks } from '../interfaces/book.interface';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ unique: true, index: true })
  googleId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  authors: string[];

  @Prop({ type: Object })
  imageLinks: ImageLinks;

  @Prop([String])
  categories: string[];

  @Prop()
  publisher: string;

  @Prop()
  publishedDate: Date;

  @Prop()
  pageCount: number;

  @Prop()
  language: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
