import { Injectable } from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { Repository } from 'typeorm';
import { Todo } from './todos.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodosService {
  constructor(
    private todosRepository: TodosRepository,
    @InjectRepository(Todo)
    private todosDBrepository: Repository<Todo>,
  ) {}
  getTodos() {
    return this.todosDBrepository.find({
      relations: ['files'],
    });
  }

  getToDoById(id: number) {
    return this.todosDBrepository.findOne({
      where: { id },
      relations: ['files'],
    });
  }

  async create(todo: Omit<Todo, 'id'>) {
    return this.todosDBrepository.save(todo);
  }

  async createTodo(todo: Omit<Todo, 'id'>) {
    return this.todosDBrepository.save(todo);
  }
}
