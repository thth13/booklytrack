import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from '../../book/schemas/book.schema';

export type BookSummaryDocument = HydratedDocument<BookSummary>;

@Schema()
export class BookSummary {
  @Prop()
  summary: string;

  @Prop()
  quotes: number;

  @Prop()
  review: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  book: Book;
}

export const BookSummarySchema = SchemaFactory.createForClass(BookSummary);
