import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

export const setUpApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['bibash'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
