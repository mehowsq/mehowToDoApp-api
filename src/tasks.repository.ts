import { Injectable } from '@nestjs/common';
import { Task } from 'src/task';

@Injectable()
export class TasksRepository {
  items: Array<Task>;
  constructor() {
    this.items = [];
  }
  save(task: Task) {
    const isFound = this.findById(task.id);
    if (isFound) {
      this.update(task);
    } else {
      this.insert(task);
    }
  }

  getAll(): Task[] {
    return this.items;
  }

  findById(id: string): Task | undefined {
    return this.items.find((task) => task.id === id);
  }

  private update(updatedTask: Task): Task | undefined {
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
