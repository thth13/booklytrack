import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type BookSummaryDocument = HydratedDocument<BookSummary>;

@Schema()
export class BookSummary {
  @Prop()
  summary: string[];

  @Prop()
  quotes: string[];

  @Prop()
  review: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  book: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const BookSummarySchema = SchemaFactory.createForClass(BookSummary);
