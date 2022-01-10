const AuthenticationPayloadSchema = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const AuthenticationsValidator = {
  validateAuthenticationPayload: (payload) => {
    const { error } = AuthenticationPayloadSchema.validate(payload)
    if (error) {
      throw new InvariantError(error.message)
    }
  },
}

module.exports = AuthenticationsValidator
