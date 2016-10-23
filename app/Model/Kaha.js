'use strict'

const Lucid = use('Lucid')

class Kaha extends Lucid {
  user() {
    return this.belongsTo('App/Model/User')
  }

  transactions() {
    return this.hasMany('App/Model/Transaction', 'id', 'userId')
  }
}

module.exports = Kaha
