/**
 *
 * @param {import('./handler')} handler
 * @returns {import('@hapi/hapi').ServerRoute}
 */
const routes = (handler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
]);

module.exports = routes;
