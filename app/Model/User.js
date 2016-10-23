'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  userProperties() {
    return this.hasMany('App/Model/UserProperty', 'id', 'userId')
  }

  kaha() {
    return this.hasOne('App/Model/Kaha', 'id', 'userId')
  }

  transactions() {
    return this.hasMany('App/Model/Transaction', 'id', 'userId')
  }
}

module.exports = User
