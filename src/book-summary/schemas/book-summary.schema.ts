import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type BookSummaryDocument = HydratedDocument<BookSummary>;

class Note {
  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
export class BookSummary {
  @Prop({ type: [Note], default: [] })
  summary: Note[];

  @Prop({ type: [Note], default: [] })
  quotes: Note[];

  @Prop()
  review: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Book' })
  book: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const BookSummarySchema = SchemaFactory.createForClass(BookSummary);
