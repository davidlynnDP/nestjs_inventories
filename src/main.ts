import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('BootStrap'); 

  app.setGlobalPrefix('api');  // localhost:3000/api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen( process.env.PORT );
  logger.log(`App running on port ${ process.env.PORT }`);
}
bootstrap();

// nest new inventory-management
// docker-compose up -d

// nest g resource products --no-spec
// nest g resource inventory-movements --no-spec
// nest g resource suppliers --no-spec
// nest g resource locations --no-spec

// nest g resource company --no-spec

// nest g resource clients --no-spec
// nest g resource orders --no-spec


// nest g resource seed     --no-spec