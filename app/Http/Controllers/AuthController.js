'use strict'

const AuthOperation = use('App/Operations/AuthOperation')
const { HttpException } = use('node-exceptions')

/**
 * Auth controller
 */
class AuthController {

  /**
   * Logins user
   * @return JSON
   */
  * accessToken(request, response) {
    const op = new AuthOperation()

    op.username = request.input('username')
    op.password = request.input('password')

    let user = yield op.accessToken()

    if (user === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    let token = yield request.auth.generate(user)

    response.json({
      token: token.token,
      user
    })
  }

}

module.exports = AuthController

