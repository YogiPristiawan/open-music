const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapSongsToModel } = require('../../utils')

class SongsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = uuidv4()
    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Songs gagal ditambahkan.')
    }

    return result.rows[0].id
  }

  async getSongs(queryParam = {}) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
    }
    const queryParamKeys = Object.keys(queryParam)

    if (queryParamKeys.length > 0) {
      const bind = []

      query.text += ' WHERE'

      for (let i = 0; i < queryParamKeys.length; i++) {
        const key = queryParamKeys[i]

        query.text += ` ${key} ILIKE $${i + 1}`
        bind.push(`%${queryParam[key]}%`)

        if (i + 1 !== queryParamKeys.length) {
          query.text += ' AND'
        }
      }
      query.values = bind
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan.')
    }

    return result.rows.map(mapSongsToModel)
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan.')
    }

    return result.rows.map(mapSongsToModel)[0]
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan.')
    }

    return result.rows[0].id
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan.')
    }

    return result.rows[0].id
  }
}

module.exports = SongsService
