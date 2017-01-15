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

  * getUserKaha(request, response) {
    const op = new UserOperation()

    op.userId = request.authUser.id

    let kaha = yield op.getUserKaha()

    if (kaha === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(kaha)
  }

  * getUserStatistics(request, response) {
    let { startDate, endDate } = request.all()
    const op = new UserOperation()

    op.userId = request.authUser.id
    op.startDate = parseInt(startDate) ? startDate : null
    op.endDate = parseInt(endDate) ? endDate : null

    let statistics = yield op.getUserStatistics()

    if (statistics === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(statistics)
  }

  * dataset(request, response) {
    const op = new UserOperation()
    op.userId = request.authUser.id

    let dataset = yield op.dataset()

    if(dataset === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(dataset)
  }
}

module.exports = UsersController
