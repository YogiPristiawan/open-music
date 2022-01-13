const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor(playlistsService, songsService, playlistSongActivitiesService, validator) {
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._playlistSongActivitiesService = playlistSongActivitiesService
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this)
    this.getPlaylistSongByPlaylistIdHandler = this.getPlaylistSongByPlaylistIdHandler.bind(this)
    this.deletePlaylistSongBySongIdHandler = this.deletePlaylistSongBySongIdHandler.bind(this)
    this.deletePlaylistByPlaylistIdHandler = this.deletePlaylistByPlaylistIdHandler.bind(this)
    this.getPlaylistSongActivities = this.getPlaylistSongActivities.bind(this)
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload)

      const { name } = request.payload
      const { userId } = request.auth.credentials

      const playlistId = await this._playlistsService.addPlaylist({ name, owner: userId })

      const response = new ResponseBuilder().setStatus('success').setData({ playlistId }).build()

      return h.response(response).code(201)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { userId } = request.auth.credentials

      const playlists = await this._playlistsService.getAllPlaylistsByOwnerAndCollaborator(userId)

      const response = new ResponseBuilder().setStatus('success').setData({ playlists }).build()

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePostPlaylistSongPayload(request.payload)

      const { userId } = request.auth.credentials
      const { songId } = request.payload
      const { playlistId } = request.params

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

      await this._songsService.getSongById(songId)
      await this._playlistsService.addPlaylistSong({ playlistId, songId })
      await this._playlistSongActivitiesService.postPlaylistSongActivity({
        playlistId,
        songId,
        userId,
        action: 'add',
      })

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil tambah data song di dalam playlist')

      return h.response(response).code(201)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.')

      return h.response(response).code(500)
    }
  }

  async getPlaylistSongByPlaylistIdHandler(request, h) {
    try {
      const { playlistId } = request.params
      const { userId } = request.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

      const playlistSongs = await this._playlistsService.getSongsByPlaylistId(playlistId)
      const songs = playlistSongs.map((v) => ({
        id: v.song_id,
        title: v.song_title,
        performer: v.song_performer,
      }))

      const response = new ResponseBuilder().setStatus('success').setData({
        playlist: {
          id: playlistSongs[0].playlist_id,
          name: playlistSongs[0].playlist_name,
          username: playlistSongs[0].username,
          songs,
        },
      }).build()

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }

  async deletePlaylistSongBySongIdHandler(request, h) {
    try {
      this._validator.validateDeletePlaylistSongByPlaylistIdAndSongIdPayload(request.payload)

      const { userId } = request.auth.credentials
      const { playlistId } = request.params
      const { songId } = request.payload

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId)
      await this._playlistsService.deletePlaylistSongByPlaylistIdAndSongId(playlistId, songId)
      await this._playlistSongActivitiesService.postPlaylistSongActivity({
        playlistId,
        songId,
        userId,
        action: 'delete',
      })

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil hapus lagu di dalam playlist.').build()

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }

  async deletePlaylistByPlaylistIdHandler(request, h) {
    try {
      const { userId } = request.auth.credentials
      const { playlistId } = request.params

      await this._playlistsService.verifyPlaylistOwner(playlistId, userId)
      await this._playlistsService.deletePlaylistByPlaylistId(playlistId)

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil hapus playlist').build()

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }

  async getPlaylistSongActivities(request, h) {
    try {
      const { userId } = request.auth.credentials
      const { playlistId } = request.params

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

      const activities = await this._playlistSongActivitiesService
        .getPlaylistSongActivities(playlistId)

      const response = new ResponseBuilder().setStatus('success').setData({
        playlistId,
        activities,
      }).build()

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message).build()

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.').build()

      return h.response(response).code(500)
    }
  }
}

module.exports = PlaylistsHandler
