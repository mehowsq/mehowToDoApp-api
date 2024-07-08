import { Module } from '@nestjs/common';
import { AppService } from './app.service';

import { Pool } from 'pg';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { PgTasksRepository } from './tasks/repositories/pg-tasks.repository';
import { TasksRepository } from './tasks/repositories/tasks.repository';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    AppService,
    TasksService,
    {
      provide: TasksRepository,
      useClass: PgTasksRepository,
    },
    {
      provide: 'PgPool',
      useFactory: () => {
        return new Pool({
          user: 'postgres',
          password: 'password',
          host: 'localhost',
          port: 5432,
          database: 'postgres',
        });
      },
    },
  ],
  exports: [AppService],
})
export class AppModule {}
