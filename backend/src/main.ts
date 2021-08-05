import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
// import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.SERVER_PORT || 7000;
  const SWAGGER_PATH = process.env.SWAGGER_PATH || 'api';
  const app = await NestFactory.create(AppModule, {});

  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESCRIPTION)
    .setVersion(process.env.SWAGGER_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

async function createMicroservices() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
    },
  });
  app.listen();
}

createMicroservices();
start();
