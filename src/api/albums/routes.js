const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.addAlbum,
  },
]

module.exports = routes
