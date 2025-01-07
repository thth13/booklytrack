import { Document } from 'mongoose';
import { Book } from 'src/book/interfaces/book.interface';
import { User } from 'src/user/interfaces/user.interface';

export interface Profile extends Document {
  fullName: string;
  avatar: string;
  description: string;
  views: number;
  user: User;
  following: User;
  followers: User;
  read: Book;
  reads: Book;
  wantsToRead: Book;
}
