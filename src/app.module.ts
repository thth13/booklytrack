import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BookSummaryModule } from './book-summary/book-summary.module';
import { ProfileModule } from './profile/profile.module';
import { OpenAiModule } from './openai/openai.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'avatars'),
      serveRoot: '/avatar',
    }),
    AuthModule,
    UserModule,
    BookModule,
    BookSummaryModule,
    ProfileModule,
    OpenAiModule,
    QuizModule,
  ],
})
export class AppModule {}
