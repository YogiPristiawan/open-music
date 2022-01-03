const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSong,
  },
]

module.exports = routes
