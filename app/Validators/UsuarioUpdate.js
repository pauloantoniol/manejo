'use strict'

class UsuarioUpdate {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      senha: 'min:6|max:60',
      nome: 'max:60'
    }
  }
}

module.exports = UsuarioUpdate
