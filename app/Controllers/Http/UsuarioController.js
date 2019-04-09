'use strict'

const Env = use('Env')
const empty = require('is-empty')
const Hash = use('Hash')
const Usuario = use('App/Models/Usuario')
const Mail = use('Mail')

class UsuarioController {
  async store ({ request }) {
    const data = request.only(['email', 'senha', 'nome'])
    const usuario = await Usuario.create(data)

    await Mail.send(['emails.novo_usuario'], usuario.toJSON(), message => {
      message
        .to(usuario.email)
        .from(
          Env.get('MAIL_NAO_RESPONDER'),
          Env.get('MAIL_NAO_RESPONDER_APRESENTACAO')
        )
        .subject(`Bem-vindo(a) ao Manejo`)
    })

    return usuario
  }

  async update ({ request, response, auth }) {
    try {
      const usuario = await Usuario.findOrFail(auth.user.id)
      const data = request.all()

      if (
        !empty(data.senha) &&
        (await Hash.verify(data.senha, auth.user.senha))
      ) {
        return response.status(403).send({
          error: { mensagem: 'A senha não pode ser igual a anterior' }
        })
      }

      usuario.merge(data)
      await usuario.save()

      if (!empty(data.senha)) {
        await Mail.send(
          ['emails.senha_alterada'],
          usuario.toJSON(),
          message => {
            message
              .to(usuario.email)
              .from(
                Env.get('MAIL_NAO_RESPONDER'),
                Env.get('MAIL_NAO_RESPONDER_APRESENTACAO')
              )
              .subject(`Aviso modificação de senha - Manejo`)
          }
        )
      }
      return usuario
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { mensagem: 'Algo deu errado ao atualizar dados' } })
    }
  }
}

module.exports = UsuarioController
