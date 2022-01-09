/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'CHAR(36)',
      notNull: true,
    },
    user_id: {
      type: 'CHAR(36)',
      notNull: true,
    },
  })
}

exports.down = (pgm) => {
  pgm.dropTable('collaborations')
}
