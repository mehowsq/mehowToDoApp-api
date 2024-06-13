import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TasksController } from 'src/tasks.controller';
import { TasksRepository } from 'src/tasks.repository';
import { TasksService } from 'src/tasks.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [AppService, TasksRepository, TasksService],
  exports: [AppService],
})
export class AppModule {}
