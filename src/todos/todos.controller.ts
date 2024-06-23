import { FileInterceptor } from '@nestjs/platform-express';
import { TodosService } from './todos.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly filesService: FilesService,
  ) {
    console.log('TodosController instantiated');
  }
  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getToDoById(@Param('id') id: number) {
    console.log(typeof id);

    return this.todosService.getToDoById(id);
  }

  @Post()
  createTodo(@Body() todo: any) {
    return this.todosService.createTodo(todo);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const todo = await this.todosService.getToDoById(id);
    return this.filesService.saveFile({
      name: file.originalname,
      mimeType: file.mimetype,
      data: file.buffer,
      todo,
    });
  }
}
