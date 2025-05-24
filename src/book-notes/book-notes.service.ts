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
    return await this.noteModel.find({ user: userId, book: bookId }).sort({ createdAt: -1 });
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

  async editBookNote(noteId: string, content: string, userId: string) {
    const note = await this.noteModel.findOne({
      _id: noteId,
    });
    if (!note) {
      throw new Error('Book note not found.');
    }

    this.checkUserAccess(note, userId);
    note.content = content;

    return await note.save();
  }

  async deleteBookNote(noteId: string, userId: string) {
    const note = await this.noteModel.findById(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    this.checkUserAccess(note, userId);

    await this.noteModel.deleteOne({ _id: noteId });
  }

  private checkUserAccess(note: Note, userId: string) {
    if (note.user.toString() !== userId) {
      throw new Error('Access denied: not the owner');
    }
  }
}
