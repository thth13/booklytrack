import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import validator from 'validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, minlength: 3, maxlength: 255 })
  userName: string;

  @Prop({ required: true, lowercase: true, validate: validator.isEmail, minlength: 6, maxlength: 255 })
  email: string;

  @Prop({ required: true, minlength: 4, maxlength: 1024 })
  password: string;

  @Prop({ required: true })
  expires: Date;

  @Prop({ default: 0 })
  loginAttempts: Number;

  @Prop({ default: Date.now })
  blockExpires: Date;

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

// UserSchema.pre('save', async function (next: (err?: Error) => void) {
//   try {
//     if (!this.isModified('password')) {
//       return next();
//     }

//     // tslint:disable-next-line:no-string-literal
//     const hashed = await bcrypt.hash(this['password'], 10);
//     // tslint:disable-next-line:no-string-literal
//     this['password'] = hashed;

//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });
