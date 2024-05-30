import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

NestFactory.create(AppModule)
  .then((app) =>
    app.useGlobalPipes(new ValidationPipe()).listen(process.env.PORT),
  )
  .then(() => Logger.log(`Listening on port ${process.env.PORT}`));
