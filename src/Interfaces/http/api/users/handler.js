const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

class UsersHandler {
  #container;

  /**
   * @param {import('../../../../Infrastructures/container')} container
   */
  constructor(container) {
    this.#container = container;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async postUserHandler(request, h) {
    /** @type {AddUserUseCase} */
    const addUserUseCase = this.#container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
