const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  /**
   *
   * @param {import('@hapi/hapi').Server} server
   * @param {{container: import('../../../../Infrastructures/container')}} param1
   */
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
