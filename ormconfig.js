const dbCongig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

// console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbCongig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbCongig, {
      type: 'sqlite',
      database: 'test.db.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Unknown Environment');
}
module.exports = dbCongig;
