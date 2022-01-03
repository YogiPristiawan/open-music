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
      return new ResponseServiceProvider({
        status: this.status,
        message: this.message,
        data: this.data,
      }).generate()
    },
  }
}

module.exports = ResponseBuilder
