/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
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
    user_id: {
      type: 'CHAR(36)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    time: {
      type: 'TEXT',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities')
}
