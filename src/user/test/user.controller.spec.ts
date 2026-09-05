import { Test, TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import { of } from 'rxjs';
import { UserController } from '../user.controller';

describe('UserController', () => {
  let controller: UserController;
  const usersService = {
    findOne: jest.fn(),
    findMany: jest.fn(),
  };
  const client: Partial<ClientGrpc> = {
    getService: jest.fn().mockReturnValue(usersService),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: 'USER_PACKAGE', useValue: client }],
    }).compile();

    controller = module.get(UserController);
    controller.onModuleInit();
  });

  describe('getById', () => {
    it('delegates to the gRPC UsersService', (done) => {
      const user = { id: 1, name: 'Adele Bond' };
      usersService.findOne.mockReturnValue(of(user));

      controller.getById('1').subscribe((result) => {
        expect(usersService.findOne).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(user);
        done();
      });
    });
  });

  describe('findOne', () => {
    it('returns the matching in-memory user', () => {
      expect(controller.findOne({ id: 2 })).toEqual({
        id: 2,
        name: 'Steven Villarreal',
      });
    });

    it('throws an RpcException when the user does not exist', () => {
      expect(() => controller.findOne({ id: 999 })).toThrow(
        'User with id 999 not found',
      );
    });
  });
});
