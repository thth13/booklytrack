import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BookSummaryModule } from './book-summary/book-summary.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';

interface ValidationErrors {
  [key: string]: string;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: false,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        const result = errors.reduce<ValidationErrors>((acc, error) => {
          acc[error.property] = error.constraints ? Object.values(error.constraints)[0] : 'Validation error';
          return acc;
        }, {});
        return new BadRequestException(result);
      },
    }),
  );

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

  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = process.env.PORT || 8000;
  await app.listen(PORT);
}
bootstrap();
