'use strict'

const Schema = use('Schema')

class TransactionsTableSchema extends Schema {

  up () {
    this.table('transactions', (table) => {
      table.integer('logId').unsigned().references('id').inTable('kaha_logs')
    })
  }

  down () {
    this.table('transactions', (table) => {
      table.dropForeign('logId')
      table.dropColumn('logId')
    })
  }

}

module.exports = TransactionsTableSchema
