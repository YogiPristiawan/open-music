const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postSong = this.postSong.bind(this)
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
