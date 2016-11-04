'use strict'

const Operation = use('App/Operations/Operation')
const Hash = use('Hash')
const Token = use('App/Model/Token')
const User = use('App/Model/User')
const Validator = use('Validator')
const HTTPResponse = use('App/HTTPResponse')

/**
 * Auth operation class
 * @class
 */
class AuthOperation extends Operation {

  constructor() {
    super()
    this.username = null
    this.password = null
  }

  get rules() {
    return {
      username: 'required',
      password: 'required'
    }
  }

  /**
   * Logins user
   */
  * accessToken() {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    let user = yield User.findBy('username', this.username)

    if (!user) {
      user = yield User.findBy('email', this.username)
    }

    if (!user) {
      this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The user does not exist.')

      return false
    }

    let userProperties = yield user.userProperties().fetch()
    let properties = userProperties.toJSON()
    let passwordHash = properties[0].value
    let passwordSalt = properties[1].value
    let userPassword = this.password + passwordSalt
    let isPasswordVerified = yield Hash.verify(userPassword, passwordHash)

    if (!isPasswordVerified) {
      this.addError(HTTPResponse.STATUS_UNAUTHORIZED, 'Invalid username or password.')

      return false
    }

    return user
  }

}

module.exports = AuthOperation

