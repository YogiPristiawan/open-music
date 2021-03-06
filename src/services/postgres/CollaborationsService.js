const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class CollaborationsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addCollaboration({ playlistId, userId }) {
    const id = uuidv4()

    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Data collaborations gagal ditambahkan.')
    }

    return result.rows[0].id
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Data collaboration tidak ditemukan.')
    }

    return result.rows[0].id
  }

  async verifyCollaborationAccess(playlistId, userId) {
    const query = {
      text: `SELECT        
        playlists.owner
      FROM
        playlists        
      WHERE
        playlists.id = $1`,
      values: [playlistId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan.')
    }
    const owner = result.rows.filter((v) => v.owner === userId)

    if (!(owner.length > 0)) {
      throw new AuthorizationError('Anda tidak berhak mengakses collaborations ini.')
    }
  }
}

module.exports = CollaborationsService
