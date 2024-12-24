import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BookSummaryModule } from './book-summary/book-summary.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), AuthModule, UserModule, BookModule, BookSummaryModule],
})
export class AppModule {}
