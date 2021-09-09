import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () =>
            Object.assign(await getConnectionOptions('test'), {
              autoLoadEntities: true,
              synchronize: true,
            }),
        }),
      ],
      exports: [TypeOrmModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    service.closeDB();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a new user', async () => {
    const user = {
      email: 'test@mail.com',
      name: 'teste',
      password: 'pass',
    } as CreateUserDto;

    const newUser = await service.create(user);

    expect(newUser.user).toHaveProperty('id');
    expect(newUser.user).toHaveProperty('name');
    expect(newUser.user).toHaveProperty('email');
    expect(newUser.user.email).toStrictEqual(user.email);
    expect(newUser.user.name).toStrictEqual(user.name);
  });

  it('should not create a new user with a same name and email', async () => {
    const user = {
      email: 'test@mail.com',
      name: 'test',
      password: 'test',
    } as CreateUserDto;

    await service.create(user);

    const newUser = await service.create(user);

    expect(newUser).toHaveProperty('message');
    expect(newUser.message).toStrictEqual('User already exists');
  });

  it('should not create a new user without a name', async () => {
    const user = {
      email: 'test@mail.com',
      password: 'test',
    } as CreateUserDto;

    const newUser = await service.create(user);

    expect(newUser).toHaveProperty('message');
    expect(newUser.message).toStrictEqual('name is a required field');
  });
});
