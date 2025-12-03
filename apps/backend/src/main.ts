import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.BACKEND_PORT || 3000;
  await app.listen(port);
}

void bootstrap();
