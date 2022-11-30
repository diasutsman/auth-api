/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class AuthenticationsRepository {
  async addRefreshToken(token) {
    throw new Error('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(token) {
    throw new Error('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteRefreshToken(token) {
    throw new Error('AUTHENTICATIONS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationsRepository;
