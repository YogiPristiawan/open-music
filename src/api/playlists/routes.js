const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getPlaylistSongByPlaylistIdHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deletePlaylistSongBySongIdHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByPlaylistIdHandler,
    options: {
      auth: 'open-api_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getPlaylistSongActivities,
    options: {
      auth: 'open-api_jwt',
    },
  },
]

module.exports = routes
