import { Injectable } from '@nestjs/common';

@Injectable()
export class TodosRepository {
  private todos = [
    {
      id: 1,
      title: 'ToDo 1',
      description: 'Create NestJS app',
      isCompleted: true,
    },
    {
      id: 2,
      title: 'ToDo 2',
      description: 'Create a new branch',
      isCompleted: true,
    },
    {
      id: 3,
      title: 'ToDo 3',
      description: 'Create a new file',
      isCompleted: false,
    },
    {
      id: 4,
      title: 'ToDo 4',
      description: 'Write some code',
      isCompleted: false,
    },
  ];

  async getTodos() {
    return this.todos;
  }
}
