/* eslint-disable no-undef */
const AuthenticationsRepositoryPostgres = require('../AuthenticationsRepositoryPostgres');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthenticationsRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addRefreshToken function', () => {
    it('should add refresh token to database and persisted', async () => {
      // Arrange
      const authenticationsRepositoryPostgres = new AuthenticationsRepositoryPostgres(pool);
      const refreshToken = 'refresh_token';

      // Action
      await authenticationsRepositoryPostgres.addRefreshToken(refreshToken);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(tokens.length).toEqual(1);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError if refresh token is invalid', async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken('refresh_token');
      const authenticationsRepositoryPostgres = new AuthenticationsRepositoryPostgres(pool);

      // Action and Assert
      await expect(authenticationsRepositoryPostgres.verifyRefreshToken('wrong_refresh_token')).rejects.toThrowError(InvariantError);
    });

    it('should not throw error if refresh token is valid', async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken('refresh_token');
      const authenticationsRepositoryPostgres = new AuthenticationsRepositoryPostgres(pool);

      // Action and Assert
      await expect(authenticationsRepositoryPostgres.verifyRefreshToken('refresh_token')).resolves.not.toThrowError();
    });
  });

  describe('deleteRefreshToken function', () => {
    it('should delete refresh token', async () => {
      // Arrange
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);
      const authenticationsRepositoryPostgres = new AuthenticationsRepositoryPostgres(pool);

      // Action
      await authenticationsRepositoryPostgres.deleteRefreshToken(refreshToken);

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(tokens.length).toEqual(0);
    });
  });
});
