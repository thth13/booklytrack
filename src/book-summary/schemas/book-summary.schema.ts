import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from '../../book/schemas/book.schema';
import { User } from 'src/user/schemas/user.schema';

export type BookSummaryDocument = HydratedDocument<BookSummary>;

@Schema()
export class BookSummary {
  @Prop()
  summary: string[];

  @Prop()
  quotes: string[];

  @Prop()
  review: string;

  @Prop({ type: String, ref: 'Book' })
  book: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const BookSummarySchema = SchemaFactory.createForClass(BookSummary);
