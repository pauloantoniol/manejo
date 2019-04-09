'use strict'

class Usuario {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email|unique:usuarios',
      senha: 'required|min:6|max:60',
      nome: 'required|max:60'
    }
  }
}

module.exports = Usuario
