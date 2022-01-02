class ResponseServiceProvider {
  constructor({ status, message, data }) {
    this.status = status
    this.message = message
    this.data = data
  }

  generate() {
    const response = {}
    response.status = this.status
    if (this.message !== null) response.message = this.message
    if (this.data !== null) response.data = this.data

    return response
  }
}

module.exports = ResponseServiceProvider
