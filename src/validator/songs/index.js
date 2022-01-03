const InvariantError = require('../../exceptions/InvariantError')
const SongsPayloadSchema = require('./schema')

const validateSongPayload = (payload) => {
  const { error } = SongsPayloadSchema.validate(payload)
  if (error) {
    throw new InvariantError(error.message)
  }
}

module.exports = { validateSongPayload }
