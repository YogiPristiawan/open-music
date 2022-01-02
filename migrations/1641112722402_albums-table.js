/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable(
    'albums',
    {
      id: {
        type: 'CHAR(36)',
        primaryKey: true,
      },
      name: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      year: {
        type: 'SMALLINT',
        notNull: true,
      },
    },
    {
      ifNotExists: true,
    },
  )
}

exports.down = (pgm) => {
  pgm.dropTable('albums', {
    ifExists: true,
  })
}
