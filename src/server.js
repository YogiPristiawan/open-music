require('dotenv').config()
const Hapi = require('@hapi/hapi')

/**
 * albums
 */
const albumsPlugin = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

/**
 * songs
 */
const songsPlugin = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

/**
 * users
 */
const usersPlugin = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

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

  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()

  await server.register([
    {
      plugin: albumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        usersService,
        validator: UsersValidator,
      },
    },
  ])

  await server.start()
  // eslint-disable-next-line no-console
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()
