'use strict'

const moment = require('moment')

const Database = use('Database')
const Encryption = use('Encryption')
const Hash = use('Hash')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const User = use('App/Model/User')
const UserProperty = use('App/Model/UserProperty')
const randomString = use('randomstring')
const Token = use('App/Model/Token')
const Kaha = use('App/Model/Kaha')
const Transaction = use('App/Model/Transaction')
const TransactionType = use('App/Model/TransactionType')
const KahaLog = use('App/Model/KahaLog')

const SCENARIO_DEFAULT = 'default'
const SCENARIO_CREATE = 'create'
const SCENARIO_GET_KAHA = 'getKaha'
const SCENARIO_GET_STATISTICS = 'getStatistics'

/**
 * Users Operation
 */
class UserOperation extends Operation {

  constructor() {
    super()
    this.scenario = SCENARIO_DEFAULT
    this.userId = null
    this.username = null
    this.email = null
    this.password = null
    this.confirmPassword = null
  }

  get rules() {
    return {
      username: `required_when:scenario,${SCENARIO_CREATE}|alpha_numeric|unique:users,username`,
      email: `required_when:scenario,${SCENARIO_CREATE}|email|unique:users,email`,
      password: `required_when:scenario,${SCENARIO_CREATE}|min:8`,
      confirmPassword: `required_when:scenario,${SCENARIO_CREATE}|min:8|same:password`,
      userId: `required_when:scenario,${SCENARIO_GET_KAHA}|required_when:scenario,${SCENARIO_GET_STATISTICS}`,
    }
  }


  /**
   * Store new user.
   */
  * store() {
    this.scenario = SCENARIO_CREATE
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const user = new User()
      let salt = Encryption.encrypt(randomString.generate(32))

      user.username = this.username
      user.email = this.email

      yield user.save()

      let userProperty = new UserProperty()

      userProperty.userId = user.id
      userProperty.key = 'passwordHash'
      userProperty.value = yield Hash.make(this.password + salt, 10)

      yield userProperty.save()


      userProperty = new UserProperty()
      userProperty.userId = user.id
      userProperty.key = 'passwordSalt'
      userProperty.value = salt

      yield userProperty.save()

      const kaha = new Kaha()
      kaha.userId = user.id

      yield kaha.save()

      return user
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Get user kaha.
   */
  * getUserKaha() {
    this.scenario = SCENARIO_GET_KAHA
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const kaha = yield Kaha.findBy('userId', this.userId)

      if(!kaha) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'Kaha not found.')
        return false
      }

      return kaha
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Get user statistics.
   */
  * getUserStatistics() {
    this.scenario = SCENARIO_GET_STATISTICS
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const transactions = yield Transaction.query().where('userId', this.userId).with('type').fetch();

      let topPayin = 0;
      let topPayout = 0;

      for(let transaction of transactions) {
        if(transaction.confirmed) {
          const { amount, type } = transaction.toJSON()

          if(type.type == TransactionType.TYPE_INFLOW) {
            topPayin = topPayin > amount ? topPayin : amount
          } else {
            topPayout = topPayout > amount ? topPayout : amount
          }
        }
      }

      return { topPayin, topPayout, transactionsCount: transactions.size() }
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }

  /**
   * Get logs dataset for graph.
   */
  * dataset() {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      const monthsCount = 12;

      let endDate = moment().endOf('month');

      let startDate = moment().subtract(monthsCount - 1, 'months').startOf('month');
      let dateFormat = 'YYYY-MM-DD hh:mm:ss';

      startDate = startDate.format(dateFormat)
      endDate = endDate.format(dateFormat)

      let logs = yield KahaLog.query().where('userId', this.userId).where('created_at', '>=', startDate).where('created_at', '<=', endDate).fetch()

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
        let latestLog = null
        logs.forEach(log => {
          let createdAt = moment(log.created_at);
          if ((createdAt.isAfter(start) && createdAt.isBefore(end)) || createdAt.isSame(start) || createdAt.isSame(end)) {
            if(!latestLog) {
              latestLog = log
            } else {
              let logCreatedAt = moment(log.created_at)
              let latestLogCreatedAt = moment(latestLog.created_at)
              if(logCreatedAt.isAfter(latestLogCreatedAt)) {
                latestLog = log
              }
            }
          }
        });
        month.amount = latestLog ? latestLog.amount : 0
      });

      return months
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }
}

module.exports = UserOperation

