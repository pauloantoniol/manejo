'use strict'

const Env = use('Env')
const generator = require('generate-password')
const Usuario = use('App/Models/Usuario')
const Mail = use('Mail')

class EsqueceuSenhaController {
  async store ({ request, response }) {
    try {
      const usuario = await Usuario.findByOrFail(
        'email',
        request.input('email')
      )
      const nova_senha = generator.generate({
        length: 6,
        numbers: true,
        excludeSimilarCharacters: true
      })
      usuario.senha = nova_senha
      await usuario.save()

      await Mail.send(
        ['emails.esqueceu_senha'],
        {
          email: usuario.email,
          nova_senha,
          link: ``
        },
        message => {
          message
            .to(usuario.email)
            .from(
              Env.get('MAIL_NAO_RESPONDER'),
              Env.get('MAIL_NAO_RESPONDER_APRESENTACAO')
            )
            .subject('Recuperação de senha - Manejo')
        }
      )
    } catch (e) {
      return response.status(e.status).send({
        error: {
          mensagem:
            'Usuário não encontrado, por favor verifique e-mail digitado'
        }
      })
    }
  }
}

module.exports = EsqueceuSenhaController
