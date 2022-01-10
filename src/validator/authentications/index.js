const {
  AuthenticationPayloadSchema,
  RefreshTokenPayloadSchema,
  DeleteRefreshTokenPayloadSchema,
} = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const AuthenticationsValidator = {
  validateAuthenticationPayload: (payload) => {
    const { error } = AuthenticationPayloadSchema.validate(payload)
    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validateRefreshTokenPayload: (payload) => {
    const { error } = RefreshTokenPayloadSchema.validate(payload)
    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validateDeleteRefreshTokenPayload: (payload) => {
    const { error } = DeleteRefreshTokenPayloadSchema.validate(payload)
    if (error) {
      throw new InvariantError(error.message)
    }
  },
}

module.exports = AuthenticationsValidator
