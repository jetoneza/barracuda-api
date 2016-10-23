'use strict'

const Schema = use('Schema')

class TransactionTypesTableSchema extends Schema {

  up () {
    this.create('transaction_types', (table) => {
      table.increments()
      table.string('name')
      table.enu('type', ['inflow', 'outflow'])
      table.timestamps()
    })
  }

  down () {
    this.drop('transaction_types')
  }

}

module.exports = TransactionTypesTableSchema
