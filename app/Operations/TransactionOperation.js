'use strict'

const moment = require('moment')

const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const User = use('App/Model/User')
const Kaha = use('App/Model/Kaha')
const Transaction = use('App/Model/Transaction')
const TransactionType = use('App/Model/TransactionType')
const KahaLog = use('App/Model/KahaLog')

const SCENARIO_DEFAULT = 'default'
const SCENARIO_CREATE = 'create'
const SCENARIO_UPDATE = 'update'
const SCENARIO_CONFIRM = 'confirm'
const SCENARIO_DELETE = 'delete'

/**
 * Transaction Operation
 */
class TransactionOperation extends Operation {

  constructor() {
    super()
    this.scenario = SCENARIO_DEFAULT
    this.id = null
    this.userId = null
    this.typeId = null
    this.amount = null
    this.page = 1
    this.pageSize = 10
    this.startDate = null
    this.endDate = null
  }

  get rules() {
    return {
      userId: `required`,
      id: `required_when:scenario,${SCENARIO_UPDATE}|required_when:scenario,${SCENARIO_CONFIRM}|required_when:scenario,${SCENARIO_DELETE}`,
      typeId: `required_when:scenario,${SCENARIO_CREATE}|required_when:scenario,${SCENARIO_UPDATE}`,
      amount: `required_when:scenario,${SCENARIO_CREATE}|required_when:scenario,${SCENARIO_UPDATE}`,
    }
  }

  /**
   * Get transactions list.
   */
  * list() {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      let query = Transaction.query().where('userId', this.userId).with('type')
      console.log('get list')

      if (this.startDate && this.endDate) {
        console.log('entra', this.startDate, this.endDate)
        let dateFormat = 'YYYY-MM-DD HH:mm:ss'

        const start = moment(this.startDate).startOf('day').format(dateFormat)
        const end = moment(this.endDate).endOf('day').format(dateFormat)

        console.log(start, end)

        query = query.where('created_at', '>=', start).where('created_at', '<=', end)
      }

      let transactions = yield query.orderBy('created_at', 'desc').paginate(this.page, this.pageSize)

      return transactions
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Store new transaction.
   */
  * store() {
    this.scenario = SCENARIO_CREATE
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    if (typeof this.amount !== 'number') {
      this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'Amount should be type of number.')
      return false
    }

    try {
      const user = yield User.find(this.userId)

      if(!user) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'User not found.')
        return false
      }

      const kaha = yield Kaha.findBy('userId', this.userId)

      if(!kaha) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Kaha not found.')
        return false
      }

      const transactionType = yield TransactionType.find(this.typeId)

      if(!transactionType) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction type not found.')
        return false
      }

      const transaction = new Transaction()
      transaction.userId = user.id
      transaction.kahaId = kaha.id
      transaction.typeId = transactionType.id
      transaction.amount = this.amount
      transaction.notes = this.notes

      yield transaction.save()

      yield transaction.related('user').load()
      yield transaction.related('type').load()

      return transaction
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Update transaction.
   */
  * update() {
    this.scenario = SCENARIO_UPDATE
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    if (typeof this.amount !== 'number') {
      this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'Amount should be type of number.')
      return false
    }

    try {
      const transaction = yield Transaction.find(this.id)

      if(!transaction) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction not found.')
        return false
      }

      if(transaction.userId != this.userId) {
        this.addError(HTTPResponse.STATUS_UNAUTHORIZED, 'You can only update your own transaction.')
        return false
      }

      if(transaction.confirmed) {
        this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'You can not update a transaction that has already been confirmed.')
        return false
      }

      const kaha = yield Kaha.find(transaction.kahaId)

      const selectedTxnType = yield TransactionType.find(this.typeId)

      if(!selectedTxnType) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction type not found.')
        return false
      }

      transaction.typeId = selectedTxnType.id
      transaction.amount = this.amount
      transaction.notes = this.notes

      yield transaction.save()

      yield transaction.related('user').load()
      yield transaction.related('type').load()

      return transaction
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Confirm transaction.
   */
  * confirm() {
    this.scenario = SCENARIO_CONFIRM
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const transaction = yield Transaction.find(this.id)

      if(!transaction) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction not found.')
        return false
      }

      if(transaction.confirmed) {
        this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'Transaction is already confirmed.')
        return false
      }

      if(transaction.userId != this.userId) {
        this.addError(HTTPResponse.STATUS_UNAUTHORIZED, 'You can only confirm your own transaction.')
        return false
      }

      const user = yield User.find(this.userId)

      if(!user) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'User not found.')
        return false
      }

      const kaha = yield Kaha.findBy('userId', this.userId)

      if(!kaha) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Kaha not found.')
        return false
      }

      const transactionType = yield TransactionType.find(transaction.typeId)

      if(!transactionType) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction type not found.')
        return false
      }

      if(transactionType.type == TransactionType.TYPE_OUTFLOW) {
        if((kaha.amount - transaction.amount) < 0) {
          this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'Insufficient balance.')
          return false
        }
      }

      kaha.amount = transactionType.type == TransactionType.TYPE_INFLOW ? (kaha.amount + transaction.amount) : (kaha.amount - transaction.amount)

      yield kaha.save()

      const log = new KahaLog()
      log.userId = user.id
      log.kahaId = kaha.id
      log.amount = kaha.amount

      yield log.save()

      transaction.confirmed = true
      transaction.logId = log.id

      yield transaction.save()

      yield transaction.related('user').load()
      yield transaction.related('kaha').load()
      yield transaction.related('type').load()

      return transaction
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  * delete() {
    this.scenario = SCENARIO_DELETE
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const transaction = yield Transaction.find(this.id)

      if(!transaction) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Transaction not found.')
        return false
      }

      if(transaction.confirmed) {
        this.addError(HTTPResponse.STATUS_BAD_REQUEST, 'You can not delete confirmed transaction.')
        return false
      }

      if(transaction.userId != this.userId) {
        this.addError(HTTPResponse.STATUS_UNAUTHORIZED, 'You can only delete your own transaction.')
        return false
      }

      yield transaction.delete()

      return {success: true}
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  * getTypes() {
    try {
      const types = yield TransactionType.all()

      return types
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

}

module.exports = TransactionOperation
