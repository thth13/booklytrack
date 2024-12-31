import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { AddBookDto } from './dto/add-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async addBook(addBookDto: AddBookDto): Promise<Book> {
    const book = new this.bookModel(addBookDto);
    await book.save();

    return book;
  }
}
