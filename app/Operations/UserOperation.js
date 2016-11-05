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
const Kaha = use('App/Model/Kaha')
const Transaction = use('App/Model/Transaction')
const TransactionType = use('App/Model/TransactionType')

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
        const { amount, type } = transaction.toJSON()
        if(type.type == TransactionType.TYPE_INFLOW) {
          topPayin = topPayin > amount ? topPayin : amount
        } else {
          topPayout = topPayout > amount ? topPayout : amount
        }
      }

      return { topPayin, topPayout, transactionsCount: transactions.size() }
    } catch(e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)

      return false
    }
  }
}

module.exports = UserOperation

