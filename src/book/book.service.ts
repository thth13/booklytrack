import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import axios from 'axios';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async getBook(id: string): Promise<Book> {
    let book = await this.bookModel.findById(id);

    if (book) {
      return book;
    }

    const res = await axios.get(
      `${GOOGLE_BOOKS_API}/${id}/?key=AIzaSyC9nLTd3paExG1qsub80hlslKc3aydWJhw`,
    );

    return {
      _id: res.data.id,
      title: res.data.volumeInfo.title,
      description: res.data.volumeInfo.description,
      authors: res.data.volumeInfo.authors,
      cover: res.data.volumeInfo.imageLinks.thumbnail,
      categories: res.data.volumeInfo.categories,
      publisher: res.data.volumeInfo.publisher,
      publishedDate: res.data.volumeInfo.publishedDate,
    };
  }
}
