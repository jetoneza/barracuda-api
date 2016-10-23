'use strict'

const Lucid = use('Lucid')

class Kaha extends Lucid {
  user() {
    return this.belongsTo('App/Model/User')
  }
}

module.exports = Kaha
