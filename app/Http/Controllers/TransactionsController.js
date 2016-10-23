'use strict'
const { HttpException } = use('node-exceptions')
const TransactionOperation = use('App/Operations/TransactionOperation')

class TransactionsController {
  * store(request, response) {
    const op = new TransactionOperation()

    op.userId = request.input('userId')
    op.typeId = request.input('typeId')
    op.amount = request.input('amount')

    let transaction = yield op.store()

    if (transaction === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transaction)
  }

  * getTypes(request, response) {
    const op = new TransactionOperation()

    let types = yield op.getTypes()

    if(types === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(types)
  }
}

module.exports = TransactionsController
