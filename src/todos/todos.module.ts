import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodosRepository } from './todos.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { File } from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, File])],
  providers: [TodosService, TodosRepository, FilesService],
  controllers: [TodosController],
})
export class todosModule {}
