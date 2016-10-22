'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.table('users', (table) => {
      table.dropColumn('password')
    })
  }

  down () {
    this.table('users', (table) => {
      table.string('password', 60).notNullable()
    })
  }

}

module.exports = UsersTableSchema
