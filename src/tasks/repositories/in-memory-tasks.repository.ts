import { Injectable } from '@nestjs/common';
import { Task } from '../task';
import { FindAllTasksDto } from '../dto/find-all-tasks.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class InMemoryTasksRepository implements TasksRepository {
  items: Array<Task>;
  constructor() {
    this.items = [];
  }
  async save(task: Task): Promise<void> {
    const isFound = await this.findById(task.id);
    if (isFound) {
      this.update(task);
    } else {
      this.insert(task);
    }
  }
  async delete(id: string): Promise<void> {
    this.items = this.items.filter((curr) => curr.id !== id);
  }

  async getAll(findAllTasksDto: FindAllTasksDto): Promise<Task[]> {
    if (findAllTasksDto.isCompleted === undefined) {
      return this.items;
    } else {
      return this.items.filter((item) => {
        if (item.isCompleted === findAllTasksDto.isCompleted) {
          return item;
        }
      });
    }
  }

  async findById(id: string): Promise<Task | undefined> {
    return this.items.find((task) => task.id === id);
  }

  private update(updatedTask: Task): Task | undefined {
    // alternatywny sposób
    // this.items = this.items.map((task) => {
    //   if (task.id === updatedTask.id) {
    //     return updatedTask;
    //   }
    //   return task;
    // });
    const index = this.items.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      this.items[index] = updatedTask;
      return updatedTask;
    }
    return undefined;
  }

  private insert(task: Task): Task {
    this.items.push(task);
    return task;
  }
}
