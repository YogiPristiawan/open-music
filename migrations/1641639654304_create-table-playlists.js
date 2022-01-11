/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'CHAR(36)',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlists')
}
