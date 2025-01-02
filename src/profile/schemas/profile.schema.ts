import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';
import { User } from 'src/user/schemas/user.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop({ minlength: 3, maxlength: 255 })
  fullName: string;

  @Prop()
  avatar: string;

  @Prop({ minlength: 3, maxlength: 2048 })
  description: string;

  @Prop({ default: 0 })
  views: number;

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

export const ProfileSchema = SchemaFactory.createForClass(Profile);
