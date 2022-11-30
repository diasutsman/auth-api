/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const UsersTableTestHelper = require('../../../../tests/UserTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UserTableTestHelper = require('../../../../tests/UserTableTestHelper');
const AddUserUseCase = require('../../../Applications/use_case/AddUserUseCase');
const BcryptPasswordHash = require('../../security/BcryptPasswordHash');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukkan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UserTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
      }));
    });

    it('should throw AuthenticationError when username is not found', async () => {
      // Arrange
      const username = 'not_in_database';
      const password = 'secret_password';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUserCredential(username, password))
        .rejects.toThrowError(InvariantError);
    });

    it('should throw AuthenticationError when password is wrong', async () => {
      // Arrange
      const username = 'testing_user';
      const password = 'secret_password';
      await UsersTableTestHelper.addUser({ username, password });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {}, bcrypt);

      // Action and Assert
      await expect(userRepositoryPostgres.verifyUserCredential(username, 'wrong_password')).rejects.toThrowError(AuthenticationError);
    });

    it('should return user id when user credential is verified', async () => {
      // Arrange
      const userPayload = {
        username: 'testing_user',
        password: 'secret_password',
        fullname: 'user',
      };
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, () => '123', bcrypt);

      new AddUserUseCase({
        userRepository: userRepositoryPostgres,
        passwordHash: new BcryptPasswordHash(bcrypt),
      }).execute(userPayload);

      // Action
      const userId = await userRepositoryPostgres.verifyUserCredential(
        userPayload.username,
        userPayload.password,
      );

      // Assert
      expect(userId).toEqual('user-123');
    });
  });
});
