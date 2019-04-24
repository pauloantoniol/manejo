'use strict'

const Model = use('Model')

class Transacoes extends Model {
  usuario () {
    return this.belongsTo('App/Models/Usuario')
  }
}

module.exports = Transacoes
