'use strict'

const Lucid = use('Lucid')

class Transaction extends Lucid {
  user() {
    return this.belongsTo('App/Model/User')
  }

  type() {
    return this.belongsTo('App/Model/TransactionType', 'id', 'typeId')
  }
}

module.exports = Transaction
