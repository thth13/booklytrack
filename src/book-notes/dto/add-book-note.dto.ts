import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddBookNoteDto {
  @ApiProperty({
    description: 'Book ID',
    format: 'string',
  })
  @IsString()
  readonly bookId: string;

  @ApiProperty({
    description: 'User ID',
    format: 'string',
  })
  @IsString()
  readonly userId: string;

  @ApiProperty({
    example: 'New content for book',
    description: 'Read category of book',
    format: 'string',
  })
  @IsString()
  readonly content: string;
}
