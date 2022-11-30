const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationsRepository = require('../../Domains/authentications/AuthenticationsRepository');

class AuthenticationsRepositoryPostgres extends AuthenticationsRepository {
  #pool;

  /**
   * @param {import('../../Infrastructures/database/postgres/pool')} pool
   */
  constructor(pool) {
    super();
    this.#pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };
    await this.#pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.#pool.query(query);
  }
}

module.exports = AuthenticationsRepositoryPostgres;
