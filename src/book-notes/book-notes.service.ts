import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../book-notes/schemas/note.schema';
import { AddBookNoteDto } from './dto/add-book-note.dto';
import mongoose from 'mongoose';

@Injectable()
export class BookNotesService {
  constructor(
    @InjectModel('Note')
    private readonly noteModel: Model<Note>,
  ) {}

  async getRecentNotes(userId: string, limit: number = 5): Promise<Note[]> {
    return await this.noteModel.find({ user: userId }).limit(limit).sort({ createdAt: -1 });
  }

  async getBookNotes(userId: string, bookId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Некорректный userId: должен быть ObjectId из 24 символов');
    }
    return await this.noteModel.find({ user: userId, book: bookId });
  }

  async addBookNote(addBookEntryDto: AddBookNoteDto) {
    const { userId, bookId, content } = addBookEntryDto;

    return this.noteModel.create({
      content,
      user: userId,
      book: bookId,
      createdAt: new Date(),
    });
  }

  async editBookNote(noteId: string, content: string) {
    const bookNote = await this.noteModel.findOne({
      _id: noteId,
    });

    if (!bookNote) {
      throw new Error('Book note not found.');
    }

    bookNote.content = content;

    return await bookNote.save();
  }

  async deleteBookNote(noteId: string) {
    await this.noteModel.deleteOne({ _id: noteId });
  }
}
