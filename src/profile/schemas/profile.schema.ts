import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';
import { User } from 'src/user/schemas/user.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop({ maxlength: 255 })
  name: string;

  @Prop()
  avatar: string;

  @Prop({ maxlength: 2048 })
  description: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  following: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  followers: User[];

  @Prop({ type: [String], ref: 'Book' })
  read: string[];

  @Prop({ type: [String], ref: 'Book' })
  reads: string[];

  @Prop({ type: [String], ref: 'Book' })
  wantsToRead: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
