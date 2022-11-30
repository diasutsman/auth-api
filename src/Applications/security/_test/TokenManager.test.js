/* eslint-disable no-undef */
const TokenManager = require('../TokenManager');

describe('TokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const tokenManager = new TokenManager();

    // Action & Assert
    await expect(tokenManager.generateAccessToken({})).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.generateRefreshToken({})).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.verifyRefreshToken('refreshToken')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
