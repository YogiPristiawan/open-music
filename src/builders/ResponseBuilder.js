const ResponseServiceProvider = require('../providers/ResponseServiceProvider')

const ResponseBuilder = function () {
  return {
    setStatus(value) {
      this.status = value
      return this
    },

    setMessage(value) {
      this.message = value
      return this
    },

    setData(value) {
      this.data = value
      return this
    },

    build() {
      return new ResponseServiceProvider(this.status, this.message, this.data).generate()
    },
  }
}

module.exports = ResponseBuilder
