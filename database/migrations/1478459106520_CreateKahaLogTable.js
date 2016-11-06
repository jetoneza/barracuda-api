'use strict'

const Schema = use('Schema')

class KahaLogsTableSchema extends Schema {

  up () {
    this.create('kaha_logs', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION')
      table.integer('kahaId').unsigned().references('id').inTable('kahas')
      table.decimal('amount', 13, 2).notNullable().default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('kaha_logs')
  }

}

module.exports = KahaLogsTableSchema
