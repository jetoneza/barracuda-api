'use strict'

const Lucid = use('Lucid')

class KahaLog extends Lucid {
  static get hidden () {
    return ['userId', 'kahaId', 'typeId']
  }

  user() {
    return this.belongsTo('App/Model/User', 'id', 'userId')
  }

  kaha() {
    return this.belongsTo('App/Model/Kaha', 'id', 'kahaId')
  }

  transaction() {
    return this.hasOne('App/Model/Transaction', 'id', 'logId')
  }
}

module.exports = KahaLog
