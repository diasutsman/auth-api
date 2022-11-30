const PasswordHash = require('../../Applications/security/PasswordHash');

class BcryptPasswordHash extends PasswordHash {
  #bcrypt;

  #saltRound;

  /**
     *
     * @param {import('bcrypt')} bcrypt
     * @param {Number} saltRound
     */
  constructor(bcrypt, saltRound = 10) {
    super();
    this.#bcrypt = bcrypt;
    this.#saltRound = saltRound;
  }

  async hash(password) {
    return this.#bcrypt.hash(password, this.#saltRound);
  }
}

module.exports = BcryptPasswordHash;
