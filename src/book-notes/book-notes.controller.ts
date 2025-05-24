import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Put, UseGuards, Get, Param } from '@nestjs/common';
import { BookNotesService } from './book-notes.service';
import { CheckAccessGuard } from 'src/auth/guards/checkAccess.guard';
import { AddBookNoteDto } from './dto/add-book-note.dto';

@Controller('book-notes')
export class BookNotesController {
  constructor(private readonly bookNotesService: BookNotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(CheckAccessGuard)
  async addBookNote(@Body() addBookNoteDto: AddBookNoteDto) {
    return await this.bookNotesService.addBookNote(addBookNoteDto);
  }

  @Get('recent/:userId')
  @HttpCode(HttpStatus.OK)
  async getRecentNotes(@Param('userId') userId: any) {
    return await this.bookNotesService.getRecentNotes(userId);
  }

  @Get(':userId/:bookId')
  @HttpCode(HttpStatus.OK)
  async getBookNotes(@Param('userId') userId: string, @Param('bookId') bookId: string) {
    return await this.bookNotesService.getBookNotes(userId, bookId);
  }

  @Delete(':noteId')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(CheckAccessGuard)
  async deleteBookNote(@Param('noteId') noteId: string) {
    return await this.bookNotesService.deleteBookNote(noteId);
  }

  @Put(':noteId')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(CheckAccessGuard)
  async editBookNote(@Param('noteId') noteId: string, @Body('content') content: string) {
    return await this.bookNotesService.editBookNote(noteId, content);
  }
}
