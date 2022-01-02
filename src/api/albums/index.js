const routes = require('./routes')
const AlbumsHandler = require('./handler')

const AlbumsPlugin = {
  name: 'album plugin',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator)

    server.route(routes(albumsHandler))
  },
}

module.exports = AlbumsPlugin
