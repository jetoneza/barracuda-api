'use strict'
const { HttpException } = use('node-exceptions')
const UserOperation = use('App/Operations/UserOperation')

class UsersController {
  * store(request, response) {
    const op = new UserOperation()

    op.username = request.input('username')
    op.email = request.input('email')
    op.password = request.input('password')
    op.confirmPassword = request.input('confirmPassword')

    let user = yield op.store()

    if (user === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    let token = yield request.auth.generate(user)

    response.json({
      token: token.token,
      user,
    })
  }
}

module.exports = UsersController
