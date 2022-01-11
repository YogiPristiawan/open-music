const ResponseBuilder = require('../../builders/ResponseBuilder')
const ClientError = require('../../exceptions/ClientError')

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._validator = validator
    this._tokenManager = tokenManager

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validateAuthenticationPayload(request.payload)

      const { username, password } = request.payload
      const userId = await this._usersService.verifyUserCredentials({ username, password })
      const accessToken = this._tokenManager.generateAccessToken({ userId })
      const refreshToken = this._tokenManager.generateRefreshToken({ userId })

      await this._authenticationsService.addRefreshToken(refreshToken)

      const response = new ResponseBuilder().setStatus('success').setData({ accessToken, refreshToken })

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

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validateRefreshTokenPayload(request.payload)

      const { refreshToken } = request.payload
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken)

      await this._authenticationsService.verifyRefreshToken(refreshToken)

      const accessToken = this._tokenManager.generateAccessToken({ userId })

      const response = new ResponseBuilder().setStatus('success').setData({ accessToken })

      return h.response(response).code(200)
    } catch (err) {
      if (err instanceof ClientError) {
        const response = new ResponseBuilder().setStatus('fail').setMessage(err.message)

        return h.response(response).code(err.statusCode)
      }

      console.error(err)

      const response = new ResponseBuilder().setStatus('error').setMessage('Maaf, sepertinya terjadi kesalahan di sever kami.')

      return h.response(response).code(500)
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteRefreshTokenPayload(request.payload)

      const { refreshToken } = request.payload

      await this._authenticationsService.verifyRefreshToken(refreshToken)
      await this._authenticationsService.deleteRefreshToken(refreshToken)

      const response = new ResponseBuilder().setStatus('success').setMessage('Berhasl hapus refresh token.').build()

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

module.exports = AuthenticationsHandler
