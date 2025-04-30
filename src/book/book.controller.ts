import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get book' })
  @ApiOkResponse({})
  async getBook(@Param('id') id: string) {
    return this.bookService.getBook(id);
  }
}
