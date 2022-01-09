const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class UsersHandler {
  constructor(usersService, validator) {
    this._usersService = usersService
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayloadSchema(request.payload)

      const { username, password, fullname } = request.payload

      await this._usersService.verifyUsername(username)
      const userId = await this._usersService.addUser({ username, password, fullname })

      const response = new ResponseBuilder().setStatus('success').setData({ userId }).build()

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
}

module.exports = UsersHandler
