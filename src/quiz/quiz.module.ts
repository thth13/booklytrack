import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizGateway } from './quiz.gateway';
import { QuizResult, QuizResultSchema } from './schemas/quiz-result.schema';
import { QuizAnswer, QuizAnswerSchema } from './schemas/quiz-answer.schema';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
      { name: QuizAnswer.name, schema: QuizAnswerSchema },
    ]),
    OpenAiModule,
  ],
  providers: [QuizGateway],
})
export class QuizModule {}
