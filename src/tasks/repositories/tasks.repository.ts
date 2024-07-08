import { Task } from '../task';
import { FindAllTasksDto } from '../dto/find-all-tasks.dto';

export const TasksRepository = Symbol('TasksRepository');
export interface TasksRepository {
  save(task: Task): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(findAllTasksDto: FindAllTasksDto): Promise<Task[]>;
  findById(id: string): Promise<Task | undefined>;
}
