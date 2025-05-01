import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Book } from './schemas/book.schema';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get book' })
  @ApiOkResponse({})
  async getBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.getBook(id);
  }
}
