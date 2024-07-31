import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { Task } from './task';
import { TasksRepository } from './repositories/tasks.repository';
@Injectable()
export class TasksService {
  logger = new Logger(TasksService.name);
  tasksRepository: TasksRepository;
  constructor(@Inject(TasksRepository) tasksRepository: TasksRepository) {
    this.tasksRepository = tasksRepository;
  }
  async create(createTaskDto: CreateTaskDto) {
    const newTask = new Task(
      v4(),
      createTaskDto.title,
      createTaskDto.description,
      false,
      new Date(),
    );
    await this.tasksRepository.save(newTask);
    return newTask;
  }

  getAll(findAllTasksDto: FindAllTasksDto): Promise<Task[]> {
    return this.tasksRepository.getAll(findAllTasksDto);
  }

  get(id: string) {
    return this.tasksRepository.findById(id);
  }

  async toggleCompleted(id: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id);
    if (task) {
      task.isCompleted = !task.isCompleted;
      this.tasksRepository.save(task);
      return task;
    }
    throw new NotFoundException('Task not found');
  }

  //Napisz funkcje która dla nie istniejącego taska rzuci błąd
  async delete(id: string) {
    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.tasksRepository.delete(id);
  }
}
