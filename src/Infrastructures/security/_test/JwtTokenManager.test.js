/* eslint-disable no-undef */
const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  describe('generateAccessToken function', () => {
    it('should generate token randomly based on payload', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const tokenArray = [];

      // Action
      tokenArray.push(await jwtTokenManager.generateAccessToken({ id: 'user-123' }));
      tokenArray.push(await jwtTokenManager.generateAccessToken({ id: 'user-124' }));
      tokenArray.push(await jwtTokenManager.generateAccessToken({ id: 'user-125' }));
      tokenArray.push(await jwtTokenManager.generateAccessToken({ id: 'user-126' }));

      // Assert
      expect(new Set(tokenArray).size).toEqual(tokenArray.length);
    });
  });

  describe('generateRefreshToken function', () => {
    it('should generate token randomly based on payload', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const tokenArray = [];

      // Action
      tokenArray.push(await jwtTokenManager.generateRefreshToken({ id: 'user-123' }));
      tokenArray.push(await jwtTokenManager.generateRefreshToken({ id: 'user-124' }));
      tokenArray.push(await jwtTokenManager.generateRefreshToken({ id: 'user-125' }));
      tokenArray.push(await jwtTokenManager.generateRefreshToken({ id: 'user-126' }));

      // Assert
      expect(new Set(tokenArray).size).toEqual(tokenArray.length);
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError if refresh token is invalid', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);

      // Action and Assert
      expect(jwtTokenManager.verifyRefreshToken('invalid_refresh_token')).rejects.toThrowError(InvariantError);
    });

    it('should return decoded payload based on given refresh token', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt);
      const expectedPayload = { id: 'user-123' };
      const refreshToken = await jwtTokenManager.generateRefreshToken(expectedPayload);

      // Action
      const payload = await jwtTokenManager.verifyRefreshToken(refreshToken);

      // Assert
      expect(payload.id).toEqual(expectedPayload.id);
    });
  });
});
