const PlaylistsHandler = require('./handler')
const routes = require('./routes')

const PlaylistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: (server, { playlistsService, songsService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, songsService, validator)

    server.route(routes(playlistsHandler))
  },
}

module.exports = PlaylistsPlugin
