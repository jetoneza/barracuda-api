'use strict'
const { HttpException } = use('node-exceptions')
const TransactionOperation = use('App/Operations/TransactionOperation')

class TransactionsController {
  * store(request, response) {
    const op = new TransactionOperation()

    op.userId = request.authUser.id
    op.typeId = request.input('typeId')
    op.amount = request.input('amount')
    op.notes = request.input('notes')

    let transaction = yield op.store()

    if (transaction === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transaction)
  }

  * update(request, response) {
    const op = new TransactionOperation()

    op.userId = request.authUser.id
    op.id = request.param('id')
    op.typeId = request.input('typeId')
    op.amount = request.input('amount')
    op.notes = request.input('notes')

    let transaction = yield op.update()

    if (transaction === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transaction)
  }

  * delete(request, response) {
    const op = new TransactionOperation()

    op.userId = request.authUser.id
    op.id = request.param('id')

    let transaction = yield op.delete()

    if (transaction === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transaction)
  }

  * confirm(request, response) {
    const op = new TransactionOperation()

    op.userId = request.authUser.id
    op.id = request.param('id')

    let transaction = yield op.confirm()

    if (transaction === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transaction)
  }

  * list(request, response) {
    const { page, pageSize } = request.all()
    const op = new TransactionOperation()

    op.page = page ? page : 1
    op.pageSize = pageSize ? pageSize : 10
    op.userId = request.authUser.id

    let transactions = yield op.list()

    if(transactions === false) {
      let error = op.getFirstError()

      throw new HttpException(error.message, error.code)

      return
    }

    response.json(transactions)
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
