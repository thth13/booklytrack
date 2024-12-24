import { Module } from '@nestjs/common';
import { BookSummaryService } from './book-summary.service';
import { BookSummaryController } from './book-summary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSummary, BookSummarySchema } from './schemas/book-summary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BookSummary.name, schema: BookSummarySchema }])],
  controllers: [BookSummaryController],
  providers: [BookSummaryService],
})
export class BookSummaryModule {}
