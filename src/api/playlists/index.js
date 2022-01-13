const PlaylistsHandler = require('./handler')
const routes = require('./routes')

const PlaylistsPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: (server, {
    playlistsService, songsService, playlistSongActivitiesService, validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      playlistSongActivitiesService,
      validator,
    )

    server.route(routes(playlistsHandler))
  },
}

module.exports = PlaylistsPlugin
