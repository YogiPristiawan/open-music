const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const InvariantError = require('../../exceptions/InvariantError')

class AlbumsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addAlbum({ name, year }) {
    const id = uuidv4()

    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan.')
    }

    return result.rows[0].id
  }
}

module.exports = AlbumsService
