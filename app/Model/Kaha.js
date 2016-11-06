'use strict'

const Lucid = use('Lucid')

class Kaha extends Lucid {
  user() {
    return this.belongsTo('App/Model/User', 'id', 'userId')
  }

  transactions() {
    return this.hasMany('App/Model/Transaction', 'id', 'kahaId')
  }

  logs() {
    return this.hasMany('App/Model/KahaLog', 'id', 'kahaId')
  }
}

module.exports = Kaha
