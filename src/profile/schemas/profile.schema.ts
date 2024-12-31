import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ minlength: 3, maxlength: 255 })
  fullName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  following: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  read: Book;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  reads: Book;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  wantsToRead: Book;
}

export const UserSchema = SchemaFactory.createForClass(User);
