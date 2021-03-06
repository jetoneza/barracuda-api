'use strict'

const Lucid = use('Lucid')

class Transaction extends Lucid {
  static get hidden () {
    return ['userId', 'kahaId', 'typeId']
  }

  user() {
    return this.belongsTo('App/Model/User', 'id', 'userId')
  }

  kaha() {
    return this.belongsTo('App/Model/Kaha', 'id', 'kahaId')
  }

  type() {
    return this.belongsTo('App/Model/TransactionType', 'id', 'typeId')
  }

  log() {
    return this.belongsTo('App/Model/KahaLog', 'id', 'logId')
  }
}

module.exports = Transaction
