import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Book } from './interfaces/book.interface';
import { BookDocument } from './schemas/book.schema';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<BookDocument>) {}

  async getBook(googleBookId: string): Promise<Book> {
    const book = await this.bookModel.findOne({ googleId: googleBookId });

    if (!book) {
      const res = await axios.get(`${GOOGLE_BOOKS_API}/${googleBookId}/?key=AIzaSyC9nLTd3paExG1qsub80hlslKc3aydWJhw`);

      return await this.bookModel.create({
        googleId: res.data.id,
        title: res.data.volumeInfo.title,
        description: res.data.volumeInfo.description,
        authors: res.data.volumeInfo.authors,
        imageLinks: res.data.volumeInfo.imageLinks,
        categories: res.data.volumeInfo.categories,
        publisher: res.data.volumeInfo.publisher,
        publishedDate: res.data.volumeInfo.publishedDate,
      });
    }

    return book;
  }
}
