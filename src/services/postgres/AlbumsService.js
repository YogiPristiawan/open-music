const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

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

  async getAlbumById(id) {
    const query = {
      text: `
      SELECT 
        albums.*, 
        CASE
        WHEN
          songs.album_id IS NOT NULL
          THEN
          json_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer))
        ELSE
          null
        END AS songs
      FROM 
        albums 
      LEFT JOIN 
        songs ON songs.album_id = albums.id 
      WHERE albums.id = $1
      GROUP BY 
        albums.id,
        songs.album_id`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan.')
    }

    result.rows = result.rows.map((v, i, arr) => {
      if (v.songs === null) {
        const { songs, ...except } = arr[i]
        return except
      }

      return v
    })

    return result.rows[0]
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan.')
    }

    return result
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan.')
    }

    return result
  }
}

module.exports = AlbumsService
