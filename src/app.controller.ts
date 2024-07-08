import { Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post()
  // addNewTask(@Body() createTaskDto: CreateTaskDto) {
  //   this.logger.debug(createTaskDto);
  //   return this.appService.addNewTask(createTaskDto);
  // }
  @Get()
  getAllTasks() {
    return this.appService.getAllTasks();
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    console.log(id);
    return this.appService.getAllTasks();
  }
  // @Patch(':id')
  // updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.appService.updateTask(id, updateTaskDto);
  // }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return id;
  }
}
