/* eslint-disable no-undef */
const AuthenticationsRepository = require('../AuthenticationsRepository');

describe('AuthenticationsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationsRepository = new AuthenticationsRepository();

    // Action and Assert
    await expect(authenticationsRepository.addRefreshToken('')).rejects.toThrowError('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationsRepository.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationsRepository.deleteRefreshToken('')).rejects.toThrowError('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
