import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task } from 'src/task';
import { TasksRepository } from 'src/tasks.repository';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { v4 } from 'uuid';

@Injectable()
export class TasksService {
  logger = new Logger(TasksService.name);
  tasksRepository: TasksRepository;
  constructor(@Inject(TasksRepository) tasksRepository: TasksRepository) {
    this.tasksRepository = tasksRepository;
  }
  create(createTaskDto: CreateTaskDto) {
    this.logger.debug(createTaskDto);
    const newTask = new Task(
      v4(),
      createTaskDto.title,
      createTaskDto.description,
      false,
      new Date(),
    );
    this.tasksRepository.save(newTask);
    return newTask;
  }

  getAll(): Task[] {
    return this.tasksRepository.getAll();
  }

  toggleCompleted(id: string): Task {
    const task = this.tasksRepository.findById(id);
    if (task) {
      task.isCompleted = !task.isCompleted;
      this.tasksRepository.save(task);
      return task;
    }
    throw new NotFoundException('Task not found');
  }
}
