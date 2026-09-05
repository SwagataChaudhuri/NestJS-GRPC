import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { grpcClientOptions } from './../src/grpc-client.options';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /user/:id returns the user resolved over gRPC', () => {
    return request(app.getHttpServer())
      .get('/user/1')
      .expect(200)
      .expect({ id: 1, name: 'Adele Bond' });
  });

  it('GET /user/:id returns an error for an unknown id', () => {
    return request(app.getHttpServer()).get('/user/999').expect(500);
  });

  it('GET /user streams the requested users back', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect([
        { id: 1, name: 'Adele Bond' },
        { id: 2, name: 'Steven Villarreal' },
      ]);
  });
});
