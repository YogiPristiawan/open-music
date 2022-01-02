const InvariantError = require('../../exceptions/InvariantError')

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.addAlbum = this.addAlbum.bind(this)
  }

  async addAlbum(request, h) {
    try {
      this._validator.validatePayload(request.payload)

      const { name, year } = request.payload

      const id = await this._service.addAlbum({ name, year })

      return h.response({
        status: 'success',
        data: {
          albumId: id,
        },
      })
    } catch (err) {
      if (err instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: err.message,
        }).code(err.statusCode)
      }

      console.error(err)

      return h.response({
        status: 'error',
        message: 'Maaf, sepertinya terjadi kesalahan di server kami.',
      }).code(500)
    }
  }
}

module.exports = AlbumsHandler
