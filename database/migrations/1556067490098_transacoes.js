'use strict'

const Schema = use('Schema')

class Transacoes extends Schema {
  up () {
    this.create('transacoes', table => {
      table.increments()
      table
        .integer('usuario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.date('transacao_data').notNullable()
      table
        .string('tipo', 1)
        .notNullable()
        .defaultTo('D')
      table.string('nome', 30).notNullable()
      table
        .float('valor', 7, 2)
        .notNullable()
        .defaultTo(0)
      table
        .boolean('executado')
        .notNullable()
        .defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('transacoes')
  }
}

module.exports = Transacoes
