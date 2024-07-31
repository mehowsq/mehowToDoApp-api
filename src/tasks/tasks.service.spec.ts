import { NotFoundException } from '@nestjs/common';
import { InMemoryTasksRepository } from './repositories/in-memory-tasks.repository';
import { TasksRepository } from './repositories/tasks.repository';
import { Task } from './task';
import { TasksService } from './tasks.service';

describe('Tasks Service', () => {
  describe('create', () => {
    let tasksRepository: TasksRepository;
    let tasksService: TasksService;

    beforeEach(() => {
      tasksRepository = new InMemoryTasksRepository();
      tasksService = new TasksService(tasksRepository);
    });

    it('return a new task', async () => {
      const task = await tasksService.create({
        description: 'test description',
        title: 'my first test',
      });
      expect(task.title).toEqual('my first test');
      expect(task.description).toEqual('test description');

      const taskInDb = await tasksRepository.findById(task.id);
      expect(taskInDb).toBeInstanceOf(Task);
    });
  });

  describe('get', () => {
    let tasksRepository: TasksRepository;
    let tasksService: TasksService;

    beforeEach(() => {
      tasksRepository = new InMemoryTasksRepository();
      tasksService = new TasksService(tasksRepository);
    });

    describe("when there isn't task with id unexisted-id", () => {
      it('return undefined', async () => {
        expect(await tasksService.get('unexisted-id')).toBe(undefined);
      });
    });
    describe('when there is task with id abc', () => {
      const taskId = 'abc';
      beforeEach(async () => {
        await tasksRepository.save(
          new Task(taskId, 'title', 'description', false, new Date()),
        );
      });

      it('return task when there is task in database with passed id', async () => {
        const foundTask = await tasksService.get(taskId);
        expect(foundTask?.id).toBe(taskId);
      });
    });
  });

  describe('getAll', () => {
    it('return all tasks', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
      const task1 = new Task('1', 'title1', 'desc1', false, new Date());
      const task2 = new Task('2', 'title2', 'desc2', true, new Date());
      await tasksRepository.save(task1);
      await tasksRepository.save(task2);

      const tasks = await tasksService.getAll({});
      expect(tasks).toHaveLength(2);
      expect(tasks).toContainEqual(task1);
      expect(tasks).toContainEqual(task2);
    });

    it('filter tasks by isCompleted', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
      const task1 = new Task('1', 'title1', 'desc1', false, new Date());
      const task2 = new Task('2', 'title2', 'desc2', true, new Date());
      await tasksRepository.save(task1);
      await tasksRepository.save(task2);

      const incompleteTasks = await tasksService.getAll({ isCompleted: false });
      expect(incompleteTasks).toHaveLength(1);
      expect(incompleteTasks[0]).toEqual(task1);
    });
  });

  describe('delete', () => {
    it('delete the task', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
      const task = new Task('1', 'title', 'desc', false, new Date());
      await tasksRepository.save(task);

      await tasksService.delete('1');
      const deletedTask = await tasksRepository.findById('1');
      expect(deletedTask).toBeUndefined();
    });

    it('throw error when deleting non-existent task', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
      // expect(async () => await tasksService.delete('non-existent')).toThrow();
      await expect(tasksService.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleCompleted', () => {
    let tasksRepository: TasksRepository;
    let tasksService: TasksService;

    beforeEach(() => {
      tasksRepository = new InMemoryTasksRepository();
      tasksService = new TasksService(tasksRepository);
    });

    it('should toggle task completion status from false to true', async () => {
      const task = new Task('1', 'title', 'description', false, new Date());
      await tasksRepository.save(task);

      const updatedTask = await tasksService.toggleCompleted('1');
      expect(updatedTask.isCompleted).toBe(true);

      const taskInDb = await tasksRepository.findById('1');
      expect(taskInDb?.isCompleted).toBe(true);
    });

    it('should toggle task completion status from true to false', async () => {
      const task = new Task('1', 'title', 'description', true, new Date());
      await tasksRepository.save(task);

      const updatedTask = await tasksService.toggleCompleted('1');
      expect(updatedTask.isCompleted).toBe(false);

      const taskInDb = await tasksRepository.findById('1');
      expect(taskInDb?.isCompleted).toBe(false);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      await expect(
        tasksService.toggleCompleted('non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
