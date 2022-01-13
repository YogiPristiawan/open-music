const ClientError = require('../../exceptions/ClientError')
const ResponseBuilder = require('../../builders/ResponseBuilder')

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._usersService = usersService
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload)

      const { playlistId, userId } = request.payload
      const { userId: ownerId } = request.auth.credentials

      await this._usersService.verifyUserExist(userId)
      await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId)

      const collaborationId = await this._collaborationsService
        .addCollaboration({ playlistId, userId })
      const response = new ResponseBuilder().setStatus('success').setData({ collaborationId }).build()

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

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateDeleteCollaborationPaylaod(request.payload)

      const { userId: ownerId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._collaborationsService.verifyCollaborationAccess(playlistId, ownerId)
      await this._collaborationsService
        .deleteCollaboration(playlistId, userId)

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasil hapus data collaboration.').build()

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
module.exports = CollaborationsHandler
