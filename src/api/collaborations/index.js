const CollaborationsHandler = require('./handler')
const routes = require('./routes')

const CollaborationsPlugin = {
  name: 'collaborations',
  version: '1.0.0',
  register: (server, {
    collaborationsService, playlistsService, usersService, validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      usersService,
      validator,
    )

    server.route(routes(collaborationsHandler))
  },
}

module.exports = CollaborationsPlugin
