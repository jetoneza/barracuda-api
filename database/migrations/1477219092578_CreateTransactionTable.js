'use strict'

const Schema = use('Schema')

class TransactionsTableSchema extends Schema {

  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION')
      table.integer('kahaId').unsigned().references('id').inTable('kahas')
      table.integer('typeId').unsigned().references('id').inTable('transaction_types')
      table.float('amount').notNullable().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }

}

module.exports = TransactionsTableSchema

