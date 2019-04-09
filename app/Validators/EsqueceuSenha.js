'use strict'

class EsqueceuSenha {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email'
    }
  }
}

module.exports = EsqueceuSenha
