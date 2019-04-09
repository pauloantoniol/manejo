'use strict'

class LoginController {
  async login ({ request, response, auth }) {
    const { email, senha } = request.all()
    const token = await auth.attempt(email, senha)
    return token
  }
}

module.exports = LoginController
