const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const ResponseBuilder = require('../../builders/ResponseBuilder')

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postAlbum = this.postAlbum.bind(this)
    this.getAlbumById = this.getAlbumById.bind(this)
    this.putAlbumById = this.putAlbumById.bind(this)
    this.deleteAlbumById = this.deleteAlbumById.bind(this)
  }

  async postAlbum(request, h) {
    try {
      this._validator.validatePayload(request.payload)

      const { name, year } = request.payload

      const id = await this._service.addAlbum({ name, year })

      const response = new ResponseBuilder().setStatus('success').setData({
        albumId: id,
      })

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof InvariantError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message)

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesahalan di server kami.')

      return h.response(response).code(500)
    }
  }

  async getAlbumById(request, h) {
    try {
      const album = await this._service.getAlbumById(request.params.id)

      const response = new ResponseBuilder().setStatus('success').setData({ album })

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof NotFoundError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message)

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi error di server kami.')

      return h.response(response)
    }
  }

  async putAlbumById(request, h) {
    try {
      this._validator.validatePayload(request.payload)

      const { name, year } = request.payload

      await this._service.editAlbumById(request.params.id, { name, year })

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil edit album.')

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof NotFoundError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message)

        return h.response(response).code(err.statusCode)
      }

      console.log(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.')

      return h.response(response).code(500)
    }
  }

  async deleteAlbumById(request, h) {
    try {
      await this._service.deleteAlbumById(request.params.id)

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil hapus data.')

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof NotFoundError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message)

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di server kami.')

      return h.response(response).code(500)
    }
  }
}

module.exports = AlbumsHandler
