const ClientError = require('./ClientError')

class NotFoundError extends ClientError {
  constructor(name) {
    super(name, 404)

    this.name = 'NotFoundError'
  }
}

module.exports = NotFoundError
