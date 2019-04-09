'use strict'

class Login {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email',
      senha: 'required'
    }
  }
}

module.exports = Login
