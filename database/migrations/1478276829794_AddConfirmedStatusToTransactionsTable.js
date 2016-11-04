'use strict'

const Schema = use('Schema')

class TransactionsTableSchema extends Schema {

  up () {
    this.table('transactions', (table) => {
      table.bool('confirmed').defaultTo(false)
    })
  }

  down () {
    this.table('transactions', (table) => {
      table.dropColumn('confirmed')
    })
  }

}

module.exports = TransactionsTableSchema
