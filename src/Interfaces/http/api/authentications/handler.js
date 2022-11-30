const GetAuthenticationUseCase = require('../../../../Applications/use_case/GetAuthenticationUseCase');

class AuthenticationsHandler {
  #container;

  /**
   * @param {import('../../../../Infrastructures/container')} container
   */
  constructor(container) {
    this.#container = container;

    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
    this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async postAuthenticationsHandler(request, h) {
    /** @type {GetAuthenticationUseCase} */
    const getAuthenticationUseCase = this.#container.getInstance(GetAuthenticationUseCase.name);
    const data = await getAuthenticationUseCase.login(request.payload);

    const response = h.response({
      status: 'success',
      data,
    });

    response.code(201);
    return response;
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async putAuthenticationsHandler(request, h) {
    const { refreshToken } = request.payload

    /** @type {GetAuthenticationUseCase} */
    const getAuthenticationUseCase = this.#container.getInstance(GetAuthenticationUseCase.name);
    const accessToken = await getAuthenticationUseCase.renewAccessToken(refreshToken);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    })

    response.code(200)
    return response
  }

  /**
   * @param {import('@hapi/hapi').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async deleteAuthenticationsHandler(request, h) {
    const { refreshToken } = request.payload

    /** @type {GetAuthenticationUseCase} */
    const getAuthenticationUseCase = this.#container.getInstance(GetAuthenticationUseCase.name);
    await getAuthenticationUseCase.logout(refreshToken);

    const response = h.response({
      status: 'success',
    })

    response.code(200)
    return response
  }
}

module.exports = AuthenticationsHandler;
