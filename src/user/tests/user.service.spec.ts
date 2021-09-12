import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import * as jwt from 'jsonwebtoken';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const userMockRepository = {
      find: jest
        .fn()
        .mockImplementationOnce(() => [])
        .mockImplementationOnce(() => [
          { id: 1, email: 'test@mail.com', name: 'test' },
        ]),
      findOne: jest
        .fn()
        .mockImplementationOnce(() => [
          { id: 1, name: 'test', email: 'test@mail.com' }
        ]),
      create: jest.fn().mockImplementation((user) => ({ id: 1, ...user })),
      save: jest
        .fn()
        .mockImplementation((user) => Promise.resolve({ ...user })),
      update: jest.fn().mockImplementation((id, user) => ({
        id: id.id,
        ...user,
      })),
      delete: jest.fn().mockImplementation((id) => id),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot()],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userMockRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    jest
      .spyOn(jwt, 'sign')
      .mockImplementation(() => 'd1e00b0b5d3256f81d1b855d3d7c482fab46e0c7');
  });

  afterEach(async () => {
    await getConnection('default').close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user with valid credentials', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    const expectedResponse = {
      message: 'User created successfully',
      token: 'd1e00b0b5d3256f81d1b855d3d7c482fab46e0c7',
      user: {
        id: 1,
        email: 'test@mail.com',
        name: 'test',
      },
    };

    const newUser = await userService.create(user);

    expect(newUser).toEqual(expectedResponse);
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('should not create user with the same email', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    await userService.create(user);

    const newUser = await userService.create(user);

    expect(newUser).toHaveProperty('message');
    expect(newUser.message).toStrictEqual('User already exists');
  });

  it('should not create user without name', async () => {
    const user = {
      name: '',
      email: 'test@mail.com',
      password: 'password',
    };

    const newUser = await userService.create(user);

    expect(newUser).toHaveProperty('message');
    expect(newUser.message).toStrictEqual('name is a required field');
  });

  it('should not create user without email', async () => {
    const user = {
      name: 'test',
      email: '',
      password: 'password',
    };

    const newUser = await userService.create(user);

    expect(newUser).toHaveProperty('message');
    expect(newUser.message).toStrictEqual('email is a required field');
  });

  it('should index all users', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    await userService.create(user);

    const users = await userService.findAll();

    expect(users).toEqual([{ id: 1, name: 'test', email: 'test@mail.com' }]);
  });

  it('should index one user', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    const createdUser = await userService.create(user);

    const searchUser = await userService.findOne(createdUser.id);

    expect(searchUser).toEqual([
      { id: 1, name: 'test', email: 'test@mail.com' },
    ]);
  });

  it('should update a user with valid credentials', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    await userService.create(user);

    const updatedUser = await userService.update(1, { name: 'test2', ...user });

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser).toHaveProperty('email');
    expect(updatedUser).toHaveProperty('name');
    expect(updatedUser.id).toStrictEqual(1);
    expect(updatedUser.name).toStrictEqual(user.name);
    expect(updatedUser).toHaveProperty('name');
  });

  it('should delete a user', async () => {
    const user = {
      name: 'test',
      email: 'test@mail.com',
      password: 'password',
    };

    await userService.create(user);

    const deletedUser = await userService.remove(1);

    expect(deletedUser.id).toStrictEqual(1);
  });
});
