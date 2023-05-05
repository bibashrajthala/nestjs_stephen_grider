import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    // console.log('auth before');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email1 = 'testuser66@gmail.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email1,
        password: 'test@123',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email1);
      });
  });

  it('sign up a new user then get currently signed in user', async () => {
    const email1 = 'testuser77@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: email1,
        password: 'test@123',
      })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email1);
  });
});
