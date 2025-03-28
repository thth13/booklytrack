import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class EditProfileDto {
  @ApiProperty({
    example: 'John Smith',
    description: 'Full name',
    format: 'string',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  readonly name: string;

  @ApiProperty({
    example: 'URL',
    description: 'Avatar url',
    format: 'string',
  })
  @IsString()
  readonly avatar: string;

  @ApiProperty({
    example: 'My profile description',
    description: 'Profile description',
    format: 'string',
    maxLength: 1024,
  })
  @IsString()
  @MaxLength(1024)
  readonly description: string;
}
