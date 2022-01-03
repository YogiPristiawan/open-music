const Joi = require('joi')

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().default(null),
  albumId: Joi.string().empty('').default(null),
})

module.exports = SongsPayloadSchema
