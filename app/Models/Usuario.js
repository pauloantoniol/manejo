'use strict'

const Model = use('Model')
const Hash = use('Hash')

class Usuario extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async usuarioInstance => {
      if (usuarioInstance.dirty.senha) {
        usuarioInstance.senha = await Hash.make(usuarioInstance.senha)
      }
    })
  }

  Transacoes () {
    return this.hasMany('App/Models/Transacoes')
  }
}

module.exports = Usuario
