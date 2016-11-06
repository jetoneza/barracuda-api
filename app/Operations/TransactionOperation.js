'use strict'

const moment = require('moment')

const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const User = use('App/Model/User')
const Kaha = use('App/Model/Kaha')
const Transaction = use('App/Model/Transaction')
const TransactionType = use('App/Model/TransactionType')

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
      let transactions = yield Transaction.query().where('userId', this.userId).with('type').paginate(this.page, this.pageSize)

      return transactions
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Get transactions dataset for graph.
   */
  * dataset() {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const monthsCount = 12;

      let endDate = moment();

      let startDate = moment().subtract(monthsCount - 1, 'months').startOf('month');
      let dateFormat = 'YYYY-MM-DD hh:mm:ss';

      startDate = startDate.format(dateFormat)
      endDate = endDate.format(dateFormat)

      let transactions = yield Transaction.query().where('userId', this.userId).with('type').where('confirmed', true).where('created_at', '>=', startDate).where('created_at', '<=', endDate).fetch()

      let months = [];
      for (let i = 0; i < monthsCount; i++) {
        months.push({
          start: moment(startDate).add(i, 'months').startOf('month').format(dateFormat),
          end: moment(startDate).add(i, 'months').endOf('month').format(dateFormat),
          month: moment(startDate).add(i, 'months').startOf('month').format("MMM 'YY"),
          amount: 0,
        });
      }

      months.forEach(month => {
        let start = moment(month.start)
        let end = moment(month.end)
        let amount = 0;
        transactions.forEach(transaction => {
          let createdAt = moment(transaction.created_at);
          const { type } = transaction.toJSON()
          if ((createdAt.isAfter(start) && createdAt.isBefore(end)) || createdAt.isSame(start) || createdAt.isSame(end)) {
            amount = type.type == TransactionType.TYPE_INFLOW ? (amount + transaction.amount) : (amount - transaction.amount)
            month.amount = amount
          }
        });
      });

      return months
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

      transaction.confirmed = true

      yield transaction.save()

      kaha.amount = transactionType.type == TransactionType.TYPE_INFLOW ? (kaha.amount + transaction.amount) : (kaha.amount - transaction.amount)

      yield kaha.save()

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
