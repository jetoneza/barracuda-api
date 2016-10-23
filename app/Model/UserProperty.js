'use strict'

const Lucid = use('Lucid')

class UserProperty extends Lucid {
  user() {
    return this.belongsTo('App/Model/User', 'id', 'userId')
  }
}

module.exports = UserProperty
