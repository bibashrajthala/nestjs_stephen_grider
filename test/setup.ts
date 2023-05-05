import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  // console.log('global before');
  // console.log(join(__dirname, '..', 'test.db.sqlite'));

  try {
    await rm(join(__dirname, '..', 'test.db.sqlite'));
  } catch (error) {}
});
