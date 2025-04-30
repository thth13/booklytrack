import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ type: String })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  authors: string[];

  @Prop()
  cover: string;

  @Prop()
  categories: string[];

  @Prop()
  publisher: string;

  @Prop()
  publishedDate: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
