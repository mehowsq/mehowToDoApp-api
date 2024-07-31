import { BadRequestException, Inject } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

import { FindAllTasksDto } from '../dto/find-all-tasks.dto';
import { Task } from '../task';
import { TasksRepository } from './tasks.repository';

interface TaskEntity {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: Date;
}

export class PgTasksRepository implements TasksRepository {
  private pool: Pool;
  constructor(@Inject('PgPool') pool: Pool) {
    this.pool = pool;
  }

  async save(task: Task): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO public.tasks (id, title, description, is_completed, created_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE
           SET title = $2, description = $3, is_completed = $4`,
        [
          task.id,
          task.title,
          task.description,
          task.isCompleted,
          task.createdAt,
        ],
      );
    } catch (error) {
      throw new BadRequestException('Error while saving task');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.pool.query(
        'DELETE FROM public.tasks WHERE id = $1',
        [id],
      );
      if (result.rowCount === 0) {
        throw new BadRequestException(
          'The task with the given ID does not exist',
        );
      }
    } catch (error) {
      throw new BadRequestException('Failed to delete task');
    }
  }

  async getAll(findAllTasksDto: FindAllTasksDto): Promise<Task[]> {
    let res: QueryResult<TaskEntity>;

    if (findAllTasksDto.isCompleted === undefined) {
      res = await this.pool.query<TaskEntity>(
        'SELECT * FROM public.tasks ORDER BY id ASC ',
      );
    } else {
      res = await this.pool.query<TaskEntity>(
        'SELECT * FROM public.tasks WHERE is_completed=$1 ORDER BY id ASC ',
        [findAllTasksDto.isCompleted],
      );
    }

    return res.rows.map((entity) => {
      return new Task(
        entity.id,
        entity.title,
        entity.description,
        entity.is_completed,
        entity.created_at,
      );
    });
  }

  async findById(id: string): Promise<Task | undefined> {
    const res = await this.pool.query<TaskEntity>(
      `SELECT * FROM public.tasks 
          WHERE id::text = $1
          ORDER BY tasks.created_at DESC`,
      [id],
    );
    if (res.rows.length === 0) {
      return undefined;
    }
    const entity = res.rows[0];
    return new Task(
      entity.id,
      entity.title,
      entity.description,
      entity.is_completed,
      entity.created_at,
    );
  }
}
