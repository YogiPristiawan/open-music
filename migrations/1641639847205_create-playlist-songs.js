/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'CHAR(36)',
      notNull: true,
    },
    song_id: {
      type: 'CHAR(36)',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs')
}
