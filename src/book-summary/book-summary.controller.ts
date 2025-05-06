import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { BookSummaryService } from './book-summary.service';
import { CheckAccessGuard } from 'src/auth/guards/checkAccess.guard';
import { AddBookEntryDto } from './dto/add-book-entry.dto';
import { Get, Param } from '@nestjs/common';
import { BookEntryActionType } from 'src/types';

@Controller('book-summary')
export class BookSummaryController {
  constructor(private readonly bookSummaryService: BookSummaryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CheckAccessGuard)
  async addBookEntry(@Body() addBookEntryDto: AddBookEntryDto) {
    return await this.bookSummaryService.addBookEntry(addBookEntryDto);
  }

  @Delete(':userId/:bookId/:summaryIndex')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckAccessGuard)
  async deleteBookEntry(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
    @Param('summaryIndex') summaryIndex: number,
  ) {
    return await this.bookSummaryService.deleteBookEntry(userId, bookId, summaryIndex, BookEntryActionType.SUMMARY);
  }

  @Put(':userId/:bookId/:summaryIndex')
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckAccessGuard)
  async editBookEntry(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
    @Param('summaryIndex') summaryIndex: number,
    @Body('newValue') newValue: string,
  ) {
    return await this.bookSummaryService.editBookEntry(
      userId,
      bookId,
      summaryIndex,
      BookEntryActionType.SUMMARY,
      newValue,
    );
  }

  @Get('recent/:userId')
  @HttpCode(HttpStatus.OK)
  async getBookRecentSummaries(@Param('userId') userId: string) {
    return await this.bookSummaryService.getBookRecentSummaries(userId);
  }

  @Get(':userId/:bookId')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(CheckAccessGuard)
  async getBookSummary(@Param('userId') userId: string, @Param('bookId') bookId: string) {
    return await this.bookSummaryService.getBookSummary(userId, bookId);
  }
}
