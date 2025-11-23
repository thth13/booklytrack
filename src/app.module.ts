import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { S3Module } from 'nestjs-s3';
import { TelegrafModule } from 'nestjs-telegraf';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { ProfileModule } from './profile/profile.module';
import { OpenAiModule } from './openai/openai.module';
import { QuizModule } from './quiz/quiz.module';
import { BookNotesModule } from './book-notes/book-notes.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'avatars'),
      serveRoot: '/avatar',
    }),
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        forcePathStyle: true,
      },
    }),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
    AuthModule,
    UserModule,
    BookModule,
    ProfileModule,
    OpenAiModule,
    QuizModule,
    BookNotesModule,
    BotModule,
  ],
})
export class AppModule {}
