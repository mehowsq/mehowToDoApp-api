import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Logger,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Task } from './task';
import { TasksService } from './tasks/tasks.service';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { FindAllTasksDto } from './tasks/dto/find-all-tasks.dto';

@Controller('tasks')
export class TasksController {
  logger = new Logger(TasksController.name);
  tasksService: TasksService;

  constructor(@Inject(TasksService) tasksService: TasksService) {
    this.tasksService = tasksService;
  }
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.debug(createTaskDto);
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  getAll(@Query() getAllQuery: FindAllTasksDto): Promise<Task[]> {
    console.log(getAllQuery);
    return this.tasksService.getAll(getAllQuery);
  }

  @Get(':id')
  async getDetails(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.get(id);
    if (task === undefined) {
      throw new NotFoundException();
    }
    return task;
  }

  @Patch(':id/toggle-completed')
  toggleCompleted(@Param('id') id: string) {
    return this.tasksService.toggleCompleted(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
