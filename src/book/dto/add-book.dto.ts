import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddBookDto {
  @ApiProperty({
    example: 'Example Title',
    description: 'Title of book',
    format: 'string',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'Example Description',
    description: 'Description of book',
    format: 'string',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 'Stephen King',
    description: 'Book author',
    format: 'string',
  })
  @IsString()
  readonly author: string;

  @ApiProperty({
    example: 'URL',
    description: 'Link to book cover',
    format: 'string',
  })
  @IsString()
  readonly cover: string;

  @ApiProperty({
    example: '978-617-8111-27-8',
    description: 'Book isbn',
    format: 'string',
  })
  @IsString()
  readonly isbn: string;
}
