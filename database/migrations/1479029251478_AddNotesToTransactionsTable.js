'use strict'

const Schema = use('Schema')

class TransactionsTableSchema extends Schema {

  up () {
    this.table('transactions', (table) => {
      table.text('notes')
    })
  }

  down () {
    this.table('transactions', (table) => {
      table.dropColumn('notes')
    })
  }

}

module.exports = TransactionsTableSchema
