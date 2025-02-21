import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../src/user/user.entity';
import { TaskEntity } from '../src/tasks/task.entity';
import { AuthModule } from '../src/auth/auth.module';
import { TaskModule } from '../src/tasks/task.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { TaskCreate, TaskUpdate } from '../src/tasks/task.dto';

let app: INestApplication<App>;

// create test application
beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRootAsync({
        useFactory: () => ({
          type: "sqlite",
          database: ":memory:",
          entities: [UserEntity, TaskEntity],
          synchronize: true,
          // dropSchema: true
        })
      }),
      AuthModule, TaskModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile();

  app = moduleFixture.createNestApplication();
  return app.init();
});


const username = 'testing';
const password = 'testingpassword';
let access_token : string = '';

describe('Login and Signup', () => {
  it('signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .type('form')
      .send({ username, password })
      .expect(201)
    
    expect(res.body).toHaveProperty('registered', true);
  })

  it('login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .type('form')
      .send({ username, password })
    
    expect(res.status).toBe(201);
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty('access_token');

    if (res.body !== null) {
      const body = res.body as { access_token: any };
      access_token = body.access_token as string;
    }
  })
});

describe('Simple tasks tests', () => {

  const taskCreate : TaskCreate = {
    title: 'test task',
    description: undefined
  }
  let taskId : string = '';
  
  const taskUpdate : TaskUpdate = {
    newTitle: 'test task (updated)',
    newDescription: 'new description',
    changeCompleteStatus: true
  }
  let updatedTask : TaskEntity | undefined = undefined; 

  it('Create task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${access_token}`)
      .type('form')
      .send(taskCreate);
      
    expect(res.status).toBe(201);
    expect(res).not.toBeNull()
    expect(res.body).toHaveProperty('task');

    if (res.body !== null) {
      const body = res.body as {task : object }
      const createdTask = body.task as TaskEntity; 
      
      expect(createdTask.title).toEqual(taskCreate.title)
      
      if (createdTask.description === null) {
        expect(taskCreate.description).toBeUndefined();
      }
      else {
        expect(createdTask.description).toBe(taskCreate.description)
      }
      taskId = createdTask.id;
    }

  });

  it('Update task', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send(taskUpdate)
      .expect(200);
    
    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty('updatedTask');

    if (res.body !== null) {
      const body = res.body as {updatedTask : any};
      updatedTask = body.updatedTask as TaskEntity;

      expect(updatedTask.isComplete).toEqual(true);
      expect(updatedTask.title).toBe(taskUpdate.newTitle)
      
      if (updatedTask.description === null) {
        expect(taskUpdate.newDescription).toBeUndefined();
      }
      else {
        expect(updatedTask.description).toBe(taskUpdate.newDescription)
      }
    }
  });

  it('Get tasks', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(res.body).not.toBeNull()
    expect(res.body).toHaveProperty('tasks');
    
    if (res.body !== null) {
      const body = res.body as {tasks : any};
      const tasks : TaskEntity[] = body.tasks as TaskEntity[];
      if (updatedTask !== undefined) {
        expect(tasks).toContainEqual(updatedTask);
      }
    }
  })

  it('Delete task', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
    
    expect(res.body).not.toBeNull();
    expect(res.body).toHaveProperty('deleted');
    
    if (res.body !== null) {
      const body = res.body as {deleted : boolean};
      expect(body.deleted).toEqual(true);
    }

    // check if deleted task still exists
    const getRes = await request(app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  
    expect(getRes.body).not.toBeNull()
    expect(getRes.body).toHaveProperty('tasks');

    if (getRes.body !== null) {
      const body = getRes.body as {tasks : any};
      expect(body.tasks).toHaveLength(0)
    }
  });

});