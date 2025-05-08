import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Module({
  providers: [OpenAiService],
  exports: [OpenAiService], // Add OpenAiService to exports
})
export class OpenAiModule {}
