import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { Task } from 'src/task';
import { TasksService } from 'src/tasks.service';

@Controller('tasks')
export class TasksController {
  logger = new Logger(TasksController.name);
  tasksService: TasksService;

  constructor(@Inject(TasksService) tasksService: TasksService) {
    this.tasksService = tasksService;
  }
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    this.logger.debug(createTaskDto);
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  getAll(): Task[] {
    console.log(123);
    return this.tasksService.getAll();
  }

  @Get(':id')
  getDetails() {}

  @Patch(':id/toggle-completed')
  toggleCompleted(@Param('id') id: string) {
    return this.tasksService.toggleCompleted(id);
  }
}
