require('dotenv').config()
const Hapi = require('@hapi/hapi')
const albumsPlugin = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || '5000',
    host: process.env.HOST || 'localhost',
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: () => 'Hello world',
  })

  await server.register({
    plugin: albumsPlugin,
    options: {
      service: new AlbumsService(),
      validator: AlbumsValidator,
    },
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
