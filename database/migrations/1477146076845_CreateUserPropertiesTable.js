'use strict'

const Schema = use('Schema')

class UserPropertiesTableSchema extends Schema {

  up () {
    this.create('user_properties', (table) => {
      table.increments()
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('NO ACTION')
      table.string('key')
      table.string('value')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_properties')
  }

}

module.exports = UserPropertiesTableSchema
