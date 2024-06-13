import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  private tasks = [];
  getHello(): string {
    return 'Hello World!';
  }
  addNewTask(createTaskDto: CreateTaskDto) {
    this.logger.debug(createTaskDto);
    const newTask = {
      id: this.tasks.length + 1,
      ...createTaskDto,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks() {
    return this.tasks;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const taskIndex = this.tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex > -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updateTaskDto,
      };
      return this.tasks[taskIndex];
    }
    return null;
  }
}
