import { Module } from '@nestjs/common';
import { BookNotesService } from './book-notes.service';
import { BookNotesController } from './book-notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }])],
  controllers: [BookNotesController],
  providers: [BookNotesService],
})
export class BookNotesModule {}
