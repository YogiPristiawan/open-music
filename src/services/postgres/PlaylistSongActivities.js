/* eslint-disable no-tabs */
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || '5432',
      database: process.env.PGDATABASE,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD,
    })
  }

  async getPlaylistSongActivities() {
    const query = {
      text: `SELECT
				users.username,
				songs.title,
				playlist_song_activities.action,
				playlist_song_activities.time
			FROM
				playlist_song_activities
				INNER JOIN users ON users.id = playlist_song_activities.user_id
				INNER JOIN songs ON songs.id = playlist_song_activities.song_id
				INNER JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
      ORDER BY
        playlist_song_activities.time ASC`,
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist activities tidak ditemukan.')
    }

    return result.rows
  }

  async postPlaylistSongActivity({
    playlistId, songId, userId, action,
  }) {
    const id = uuidv4()
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Data playlist activities gagal ditambahkan.')
    }

    return result.rows[0].id
  }
}

module.exports = PlaylistSongActivitiesService
