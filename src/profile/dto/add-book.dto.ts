import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsOptional } from 'class-validator';
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
    example: 'wantsToRead',
    description: 'Old Category',
    format: 'string',
    required: false,
  })
  @IsOptional()
  readonly oldCategory?: ReadCategory;

  @ApiProperty({
    example: 'Read',
    description: 'Read category of book',
    format: 'string',
  })
  @IsOptional()
  readonly readCategory?: ReadCategory;
}
