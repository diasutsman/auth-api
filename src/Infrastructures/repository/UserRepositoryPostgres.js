const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  /**
     *
     * @param {import('../../Infrastructures/database/postgres/pool')} pool
     * @param {import('nanoid')} idGenerator
     * @param {import('bcrypt')} bcrypt
     */
  constructor(pool, idGenerator, bcrypt) {
    super();
    this.pool = pool;
    this.idGenerator = idGenerator;
    this.bcrypt = bcrypt;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  /**
   *
   * @param {import('../../Domains/users/entities/RegisterUser')} registerUser
   */
  async addUser(registerUser) {
    const id = `user-${this.idGenerator()}`;
    const { username, fullname, password } = registerUser;
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);
    return new RegisteredUser({ ...result.rows[0] });
  }

  /**
   * @param {String} username
   * @param {String} password
   */
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await this.bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}
module.exports = UserRepositoryPostgres;
