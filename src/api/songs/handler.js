const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postSong = this.postSong.bind(this)
    this.getSongs = this.getSongs.bind(this)
    this.getSongById = this.getSongById.bind(this)
    this.putSongById = this.putSongById.bind(this)
    this.deleteSongById = this.deleteSongById.bind(this)
  }

  async postSong(request, h) {
    try {
      this._validator.validateSongPayload(request.payload)

      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload

      const id = await this._service.addSong({
        title, year, genre, performer, duration, albumId,
      })

      const response = new ResponseBuilder().setStatus('success').setData({ songId: id }).build()

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

  async getSongs(request, h) {
    try {
      const songs = await this._service.getSongs()

      const response = new ResponseBuilder().setStatus('success').setData({ songs }).build()

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

  async getSongById(request, h) {
    try {
      const { id } = request.params
      const song = await this._service.getSongById(id)

      const response = new ResponseBuilder().setStatus('success').setData({ song }).build()

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

  async putSongById(request, h) {
    try {
      this._validator.validateSongPayload(request.payload)

      const { id } = request.params
      const {
        title, year, genre, performer, duration, albumId,
      } = request.payload

      await this._service.editSongById(id, {
        title, year, genre, performer, duration, albumId,
      })

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil edit song.').build()

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

  async deleteSongById(request, h) {
    try {
      const { id } = request.params

      await this._service.deleteSongById(id)

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil hapus song.').build()

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

module.exports = SongsHandler
