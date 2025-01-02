import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BookSummaryModule } from './book-summary/book-summary.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('API')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    include: [BookSummaryModule, BookModule, ProfileModule, UserModule],
  });
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
