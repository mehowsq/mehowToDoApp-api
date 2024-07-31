import { Module } from '@nestjs/common';
import { AppService } from './app.service';

import { Pool } from 'pg';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { PgTasksRepository } from './tasks/repositories/pg-tasks.repository';
import { TasksRepository } from './tasks/repositories/tasks.repository';
import { UsersRepository } from './auth/users.repository';
import { RegistrationController } from './auth/register/registration.controller';
import { RegistrationService } from './auth/register/registration.service';
import { LoginController } from './auth/login/login.controller';
import { LoginService } from './auth/login/login.service';

@Module({
  imports: [],
  controllers: [TasksController, RegistrationController, LoginController],
  providers: [
    AppService,
    TasksService,
    RegistrationService,
    UsersRepository,
    LoginService,
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
