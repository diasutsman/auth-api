const TokenManager = require('../../Applications/security/TokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends TokenManager {
  #jwt;

  /**
 * @param {import('@hapi/jwt')} jwt
 */
  constructor(jwt) {
    super();
    this.#jwt = jwt;
  }

  async generateAccessToken(payload) {
    return this.#jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async generateRefreshToken(payload) {
    return this.#jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const artifacts = this.#jwt.token.decode(refreshToken);
      this.#jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }
}

module.exports = JwtTokenManager;
