'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  userProperties() {
    return this.hasMany('App/Model/UserProperty', 'id', 'userId')
  }

}

module.exports = User
