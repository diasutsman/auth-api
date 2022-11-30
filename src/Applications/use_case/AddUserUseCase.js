const RegisterUser = require('../../Domains/users/entities/RegisterUser');

class AddUserUseCase {
  /**
   * @typedef {import('../../Domains/users/UserRepository')} UserRepository
   * @typedef {import('../security/PasswordHash')} PasswordHash
   * @param {{userRepository: UserRepository, passwordHash: PasswordHash}} payload
   */
  constructor({ userRepository, passwordHash }) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  }

  async execute(payload) {
    const registerUser = new RegisterUser(payload);
    // verify that username not being taken
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    // hash the password
    registerUser.password = await this.passwordHash.hash(registerUser.password);
    // add user to database through repository
    return this.userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
