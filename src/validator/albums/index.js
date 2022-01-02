const { AlbumPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const AlbumsValidator = {
  validatePayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },
}

module.exports = AlbumsValidator
