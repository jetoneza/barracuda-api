const Validator = use('Validator')

/**
 * Operation base class
 */
class Operation {

  constructor(params) {
    this.validator = Validator
    this.errors = []
  }

  /**
   * Get the validation rules
   * @returns {{}}
   */
  get rules() {
    return {}
  }

  /**
   * Get the error messages for each rules
   * @returns {{}}
   */
  get messages() {
    return {}
  }

  /**
   * Adds an error code and message to the array of errors
   *
   * @param {Integer} errorCode
   * @param {String} errorMessage
   */
  addError(code, message) {
    this.errors.push({code, message})
  }

  /**
   *  Validate the properties
   * @returns {boolean}
   */
  * validate(obj = null, rules = null) {

    let model = obj ? obj : this
    let validatorRules = rules ? rules : this.rules

    let validation = yield this.validator.validate(model, validatorRules, this.messages)
    if (validation.fails()) {
      this.errors = validation.messages().map(error => {
        return {
          code: 400,
          message: error.message
        }
      })

      return false
    }

    return true
  }

  /**
   * Get the error messages
   * @returns {Array}
   */
  getFirstError() {
    return this.errors[0]
  }
}

module.exports = Operation

