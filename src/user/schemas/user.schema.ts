import * as mongoose from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

export const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: [true, 'NAME_IS_BLANK'],
  },
  email: {
    type: String,
    lowercase: true,
    validate: validator.isEmail,
    maxlength: 255,
    minlength: 6,
    required: [true, 'EMAIL_IS_BLANK'],
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 1024,
    required: [true, 'PASSWORD_IS_BLANK'],
  },
  expires: {
    type: Date,
    requierd: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  blockExpires: {
    type: Date,
    default: Date.now,
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
  followers: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
  },
  read: {
    type: [Schema.Types.ObjectId],
    ref: 'books',
  },
  reads: {
    type: [Schema.Types.ObjectId],
    ref: 'books',
  },
  wantsToRead: {
    type: [Schema.Types.ObjectId],
    ref: 'books',
  },
});

UserSchema.pre('save', async function (next: (err?: Error) => void) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    // tslint:disable-next-line:no-string-literal
    const hashed = await bcrypt.hash(this['password'], 10);
    // tslint:disable-next-line:no-string-literal
    this['password'] = hashed;

    return next();
  } catch (err) {
    return next(err);
  }
});
