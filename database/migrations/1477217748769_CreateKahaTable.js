'use strict'

const Schema = use('Schema')

class KahasTableSchema extends Schema {

  up () {
    this.create('kahas', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION')
      table.float('amount').default(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('kahas')
  }

}

module.exports = KahasTableSchema
