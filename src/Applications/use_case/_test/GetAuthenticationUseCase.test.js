const AuthenticationsRepository = require('../../../Domains/authentications/AuthenticationsRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const TokenManager = require('../../security/TokenManager');
const GetAuthenticationUseCase = require('../GetAuthenticationUseCase');

/* eslint-disable no-undef */
describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedData = {
      refreshToken: 'refreshToken',
      accessToken: 'accessToken',
    };

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthenticationsRepository = new AuthenticationsRepository();
    const mockTokenManager = new TokenManager();

    /** mocking needed function */
    mockUserRepository.verifyUserCredential = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockAuthenticationsRepository.addRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTokenManager.generateRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedData.refreshToken));
    mockTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedData.accessToken));

    /** creating use case instance */
    const getAuthenticationUseCase = new GetAuthenticationUseCase({
      userRepository: mockUserRepository,
      authenticationsRepository: mockAuthenticationsRepository,
      tokenManager: mockTokenManager,
    });

    // Action
    const data = await getAuthenticationUseCase.login(useCasePayload);

    // Assert
    expect(data).toStrictEqual(expectedData);
    expect(mockUserRepository.verifyUserCredential).toBeCalledWith(
      useCasePayload.username,
      useCasePayload.password,
    );
    expect(mockAuthenticationsRepository.addRefreshToken).toBeCalledWith(expectedData.refreshToken);
  });
});
