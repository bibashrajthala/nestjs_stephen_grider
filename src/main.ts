import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { setUpApp } from './set-up';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setUpApp(app);

  await app.listen(3000);
}
bootstrap();
