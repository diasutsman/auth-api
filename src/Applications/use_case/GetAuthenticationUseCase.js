class GetAuthenticationUseCase {
  #userRepository;

  #authenticationsRepository;

  #tokenManager;

  /**
   * @param {{
   *  userRepository: import('../../Domains/users/UserRepository'),
   *  authenticationsRepository: import('../../Domains/authentications/AuthenticationsRepository'),
   * tokenManager: import('../security/TokenManager')
   * }} obj
   */
  constructor({ userRepository, authenticationsRepository, tokenManager }) {
    this.#userRepository = userRepository;
    this.#authenticationsRepository = authenticationsRepository;
    this.#tokenManager = tokenManager;
  }

  /**
   * @param {{username: String, password: String}} obj
   */
  async login({ username, password }) {
    await this.#userRepository.verifyUserCredential(username, password);

    const id = await this.#userRepository.verifyUserCredential(username, password);

    const refreshToken = await this.#tokenManager.generateRefreshToken({ id });
    const accessToken = await this.#tokenManager.generateAccessToken({ id });
    await this.#authenticationsRepository.addRefreshToken(refreshToken);
    const data = {
      accessToken,
      refreshToken,
    };

    return data;
  }

  /**
   * @param {String} refreshToken
   */
  async renewAccessToken(refreshToken) {
    // verify access token
    const { id } = await this.#tokenManager.verifyRefreshToken(refreshToken);
    await this.#authenticationsRepository.verifyRefreshToken(refreshToken);

    // Regenerate new accessToken with the id payload from refreshToken
    const accessToken = await this.#tokenManager.generateAccessToken({ id });

    return accessToken;
  }

  /**
   * @param {String} refreshToken
   */
  async logout(refreshToken) {
    await this.#authenticationsRepository.verifyRefreshToken(refreshToken);
    await this.#authenticationsRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = GetAuthenticationUseCase;
