const InvariantError = require('../../exceptions/InvariantError')
const {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
} = require('./schema')

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const { error } = PostCollaborationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },

  validateDeleteCollaborationPaylaod: (payload) => {
    const { error } = DeleteCollaborationPayloadSchema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },
}

module.exports = CollaborationsValidator
