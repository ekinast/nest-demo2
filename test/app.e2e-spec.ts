import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import exp from 'constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Get /users/ Retorns a users array with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users/');
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('Get /users/:id Retorns a user object with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/721d9824-d16b-41bf-8ff3-f165bc2f4991',
    );
    console.log(req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('Get /users/:id Throws a not found exception if user does not exist with a message "Usuario no encontrado"', async () => {
    const req = await request(app.getHttpServer()).get(
      '/users/721d9824-d16b-41bf-8ff3-f165bc2f4001',
    );
    console.log(req.body);

    expect(req.status).toBe(404);
    expect(req.body.message).toBe('Usuario no encontrado');
  });

  it('Get /users/:id Throws an error if id is not a UUID', async () => {
    const req = await request(app.getHttpServer()).get('/users/not-a-UUID');
    console.log(req.body);

    expect(req.status).toBe(400);
    expect(req.body).toBeInstanceOf(Object);
  });

  it('POST /users/signup Creates a new user and returns it with an OK status code', async () => {
    const req = await request(app.getHttpServer()).post('/users/signup').send({
      email: 'test@test.com',
      password: 'test123456',
      name: 'Test User',
    });
    console.log(req.body);

    expect(req.status).toBe(201);
    expect(req.body).toBeInstanceOf(Object);
  });
});
