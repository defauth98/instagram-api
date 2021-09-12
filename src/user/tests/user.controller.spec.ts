import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

describe('UserController', () => {
  let controller: UserController;

  const userCreateResponse = (user) => {
    if (user.name === '' || !user.name) {
      return Promise.resolve({
        message: 'name is a required field',
      });
    }

    if (user.email === '' || !user.email) {
      return Promise.resolve({
        message: 'email is a required field',
      });
    }

    return Promise.resolve({
      message: 'User created successfully',
      user: {
        id: 1,
        name: user.name,
        email: user.email,
      },
      token: '123u21u3h21uih321',
    });
  };

  const userFindAllResponse = () => [
    {
      name: 'teste',
      email: 'teste@mail.com',
    },
    {
      name: 'teste',
      email: 'teste2@mail.com',
    },
  ];

  const mockUserService = {
    create: jest.fn().mockImplementation(userCreateResponse),
    findAll: jest.fn().mockImplementation(userFindAllResponse),
  };

  const mockResponseObject = () => {
    return createMock<Response>({
      json: jest.fn().mockImplementation((json) => json),
      status: jest.fn().mockReturnThis(),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const response = mockResponseObject();

    const user = await controller.create(
      {
        name: 'test',
        email: 'test@mail.com',
        password: 'skamdksa',
      },
      response,
    );

    expect(user).toHaveProperty('message');
    expect(user).toHaveProperty('user');
    expect(user).toHaveProperty('token');
    expect(response.status).toHaveBeenCalled();
  });

  it('should not create a new user without a name', async () => {
    const response = mockResponseObject();

    const user = await controller.create(
      {
        name: '',
        email: 'test@mail.com',
        password: 'skamdksa',
      },
      response,
    );

    expect(user).toHaveProperty('message');
  });

  it('should not create a new user without a email', async () => {
    const response = mockResponseObject();

    const user = await controller.create(
      {
        name: 'test',
        email: '',
        password: 'skamdksa',
      },
      response,
    );

    expect(user).toHaveProperty('message');
  });

  it('should index all users', async () => {
    await controller.findAll();

    expect(mockUserService.findAll).toHaveBeenCalled();
  });
});
