import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookEntry, BookSummary } from './schemas/book-summary.schema';
import { AddBookEntryDto } from './dto/add-book-entry.dto';
import { BookEntryActionType } from 'src/types';

@Injectable()
export class BookSummaryService {
  constructor(
    @InjectModel('BookSummary')
    private readonly bookSummaryModel: Model<BookSummary>,
  ) {}

  async getBookSummary(userId: string, bookId: string) {
    return await this.bookSummaryModel.findOne({ user: userId, book: bookId });
  }

  async addBookEntry(addBookEntryDto: AddBookEntryDto) {
    const { userId, bookId, actionType, content } = addBookEntryDto;

    let bookSummary = await this.bookSummaryModel.findOne({ user: userId, book: bookId });

    if (!bookSummary) {
      bookSummary = await this.bookSummaryModel.create({ user: userId, book: bookId });
    }

    const newEntry = {
      content,
      createdAt: new Date(),
    };

    bookSummary[actionType].push(newEntry);

    return await bookSummary.save();
  }

  async editBookEntry(
    userId: string,
    bookId: string,
    summaryIndex: number,
    actionType: BookEntryActionType,
    newValue: string,
  ) {
    const bookSummary = await this.bookSummaryModel.findOne({
      user: userId,
      book: bookId,
    });

    if (!bookSummary) {
      throw new Error('Book summary not found for the given user and book.');
    }

    if (summaryIndex < 0 || summaryIndex >= bookSummary[actionType].length) {
      throw new Error('Invalid entry index.');
    }

    bookSummary[actionType][summaryIndex] = {
      content: newValue,
      createdAt: bookSummary[actionType][summaryIndex].createdAt,
    };

    return await bookSummary.save();
  }

  async deleteBookEntry(userId: string, bookId: string, summaryIndex: number, actionType: BookEntryActionType) {
    const bookSummary = await this.bookSummaryModel.findOne({ user: userId, book: bookId });

    if (!bookSummary && !bookSummary.summary) {
      return null;
    }

    bookSummary[actionType] = bookSummary[actionType].filter((_, idx) => idx !== summaryIndex);

    return await bookSummary.save();
  }
}
