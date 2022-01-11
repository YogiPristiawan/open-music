const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
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

      const playlists = await this._playlistsService.getAllPlaylistsByUserId(userId)

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
}

module.exports = PlaylistsHandler
