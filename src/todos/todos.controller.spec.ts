import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { FilesService } from './files.service';
import { Todo } from './todos.entity';
import { Readable } from 'stream';

describe('TodosController', () => {
  let todosController: TodosController;
  let mockTodosService: Partial<TodosService>;
  let mockFilesService: Partial<FilesService>;

  const mockTodo: Partial<Todo> = {
    title: 'Test Todo 1',
    description: 'Test Todo 1 Description',
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'example',
    originalname: 'example.txt',
    encoding: 'utf-8',
    mimetype: 'text/plain',
    size: 0,
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from([]),
  };

  beforeEach(async () => {
    mockTodosService = {
      getTodos: () =>
        Promise.resolve([{ ...mockTodo, id: 1, isCompleted: false }] as Todo[]),
      getToDoById: (id: number) =>
        Promise.resolve({ ...mockTodo, id: 1, isCompleted: false } as Todo),
      createTodo: (todo: Partial<Todo>) =>
        Promise.resolve({ ...mockTodo, id: 1, isCompleted: false } as Todo),
    };

    mockFilesService = {
      saveFile: () =>
        Promise.resolve({
          id: 1,
          name: 'example.txt',
          mimeType: 'text/plain',
          data: Buffer.from([]),
          todo: { ...mockTodo, id: 1, isCompleted: false } as Todo,
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    todosController = module.get<TodosController>(TodosController);
    mockTodosService = module.get<TodosService>(TodosService); // Obtén el servicio
    mockFilesService = module.get<FilesService>(FilesService); // Obtén el servicio si existe
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
  });

  it('getTodos() should return an array of todos', async () => {
    const todos = await todosController.getTodos();
    expect(todos).toEqual([
      {
        id: 1,
        title: 'Test Todo 1',
        description: 'Test Todo 1 Description',
        isCompleted: false,
      },
    ]);
  });

  it('createTodo() should return a new todo', async () => {
    const todo = await todosController.createTodo({
      title: 'Test Todo 1',
      description: 'Test Todo 1 Description',
    });
    expect(todo).toEqual({
      id: 1,
      title: 'Test Todo 1',
      description: 'Test Todo 1 Description',
      isCompleted: false,
    });
  });

  it('uploadFile() should upload a file', async () => {
    const file = await todosController.uploadFile(1, mockFile);
    expect(file).toEqual({
      id: 1,
      name: 'example.txt',
      mimeType: 'text/plain',
      data: Buffer.from([]),
      todo: { ...mockTodo, id: 1, isCompleted: false } as Todo,
    });
  });
});
