import { InMemoryTasksRepository } from './repositories/in-memory-tasks.repository';
import { Task } from './task';
import { TasksService } from './tasks.service';

describe('Tasks Service', () => {
  describe('create', () => {
    it('return a new task', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
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
    it("return undefined when there isn't task with passed id", async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const tasksService = new TasksService(tasksRepository);
      expect(await tasksService.get('unexisted-id')).toBe(undefined);
    });

    it('return task when there is task in database with passed id', async () => {
      const tasksRepository = new InMemoryTasksRepository();
      const taskId = 'abc';
      await tasksRepository.save(
        new Task(taskId, 'title', 'description', false, new Date()),
      );
      const tasksService = new TasksService(tasksRepository);
      const foundTask = await tasksService.get(taskId);
      expect(foundTask?.id).toBe(taskId);
    });
  });
});
// przetestować cały taskService (delete itd)
//
