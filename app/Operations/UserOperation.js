'use strict'

const Database = use('Database')
const Encryption = use('Encryption')
const Hash = use('Hash')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const User = use('App/Model/User')
const UserProperty = use('App/Model/UserProperty')
const randomString = use('randomstring')
const Token = use('App/Model/Token')

/**
 * Users Operation
 */
class UserOperation extends Operation {

  constructor() {
    super()
    this.username = null
    this.email = null
    this.password = null
    this.confirmPassword = null
  }

  get rules() {
    return {
      username: `required|alpha_numeric|unique:users,username`,
      email: `required|email|unique:users,email`,
      password: 'required|min:8',
      confirmPassword: 'required|min:8|same:password'
    }
  }


  /**
   * Store new user.
   */
  * store() {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    const user = new User()
    let userProperty = new UserProperty()
    let salt = Encryption.encrypt(randomString.generate(32))

    try {
      user.username = this.username
      user.email = this.email

      yield user.save()

      userProperty.userId = user.id
      userProperty.key = 'passwordHash'
      userProperty.value = yield Hash.make(this.password + salt, 10)

      yield userProperty.save()


      userProperty = new UserProperty()
      userProperty.userId = user.id
      userProperty.key = 'passwordSalt'
      userProperty.value = salt

      yield userProperty.save()

      return user
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }
}

module.exports = UserOperation

