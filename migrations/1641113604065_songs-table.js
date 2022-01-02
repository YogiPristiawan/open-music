/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable(
    'songs',
    {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      year: {
        type: 'SMALLINT',
        notNull: true,
      },
      genre: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      performer: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      duration: {
        type: 'SMALLINT',
        notNull: false,
      },
      album_id: {
        type: 'CHAR(36)',
        notNull: false,
      },
    },
    {
      ifNotExists: true,
    },
  )
}

exports.down = (pgm) => {
  pgm.dropTable('songs', { ifExists: true })
}
