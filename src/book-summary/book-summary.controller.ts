import { Controller } from '@nestjs/common';
import { BookSummaryService } from './book-summary.service';

@Controller('book-summary')
export class BookSummaryController {
  constructor(private readonly bookSummaryService: BookSummaryService) {}
}
