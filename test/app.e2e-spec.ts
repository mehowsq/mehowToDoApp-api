import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TasksRepository } from '../src/tasks/repositories/tasks.repository';
import { InMemoryTasksRepository } from '../src/tasks/repositories/in-memory-tasks.repository';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TasksRepository)
      .useClass(InMemoryTasksRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('given there is any tasks in the system', () => {
    describe("when user fetches task's list", () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app.getHttpServer()).get('/tasks');
      });
      it('returns empty list', () => {
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body.length).toBe(0);
      });
    });
  });

  describe('given user has already created one task', () => {
    let createdTaskid: string;
    beforeEach(async () => {
      const createTaskResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'first task', description: 'first task in e2e tests' });

      createdTaskid = createTaskResponse.body.id;
    });
    describe("when user fetches task's list", () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app.getHttpServer()).get('/tasks');
      });
      it('returns list contains one task', () => {
        expect(response.statusCode).toBe(HttpStatus.OK);
        expect(response.body[0].id).toBe(createdTaskid);
        // expect(response.body).toEqual(
        //   expect.arrayContaining([expect.objectContaining({ id: '123' })]),
        // );
      });
    });
  });

  describe('given user want to create task with title first task and descriuption ebe ebe', () => {
    const payload = {
      title: 'first task',
      description: 'ebe ebe',
    };
    describe('when user send request to create a task', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app.getHttpServer())
          .post('/tasks')
          .send(payload);
      });

      it('returns task', async () => {
        expect(response.statusCode).toEqual(HttpStatus.CREATED);
        expect(response.body).toEqual(expect.objectContaining(payload));
      });
    });
  });

  describe('given user dont sent title of a task', () => {
    const payload = {
      description: 'ebe ebe',
    };
    describe('when user send request to create a task', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app.getHttpServer())
          .post('/tasks')
          .send(payload);
      });
      // dla przećwiczenia zrobić gdy nie ma 'description'
      it('returns 400', async () => {
        console.log(response.body);
        expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'title must be a string',
            'title must be longer than or equal to 1 characters',
          ]),
        );
      });
    });
  });
});
