import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { Book } from 'src/book/interfaces/book.interface';
import { ReadCategory } from 'src/types';

export class AddBookDto {
  @ApiProperty({
    description: 'User ID',
    format: 'string',
  })
  @IsString()
  readonly userId: string;

  @ApiProperty({
    description: 'Book',
    format: 'string',
  })
  @IsObject()
  readonly book: Book;

  @ApiProperty({
    example: 'Read',
    description: 'Read category of book',
    format: 'string',
  })
  @IsString()
  readonly readCategory: ReadCategory;
}
