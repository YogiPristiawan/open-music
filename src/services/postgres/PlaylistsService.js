const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async addPlaylist({ name, owner }) {
    const id = uuidv4()

    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan.')
    }

    return result.rows[0].id
  }

  async getAllPlaylistsByUserId(userId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM
        playlists
        INNER JOIN users ON users.id = playlists.owner
      WHERE
        playlists.owner = $1      
      `,
      values: [userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan.')
    }

    return result.rows
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = uuidv4()
    const query = {
      text: 'INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlist song gagal ditambahkan.')
    }

    return result.rows[0].id
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM
        playlist_songs
        INNER JOIN playlists ON playlists.id = playlist_songs.playlist_id
        INNER JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Data lagu tidak ditemukan di dalam playlist.')
    }

    return result.rows
  }

  async verifyPlaylistOwner(userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini.')
    }
  }
}

module.exports = PlaylistsService
