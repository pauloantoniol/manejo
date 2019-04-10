'use strict'

const empty = require('is-empty')
const Hash = use('Hash')
const Usuario = use('App/Models/Usuario')
const Kue = use('Kue')
const EnviaEmail = use('App/Jobs/EnviaEmail')

class UsuarioController {
  async store ({ request }) {
    const data = request.only(['email', 'senha', 'nome'])
    const usuario = await Usuario.create(data)
    Kue.dispatch(
      EnviaEmail.key,
      {
        data: usuario,
        layout: 'novo_usuario',
        assunto: 'Bem-vindo(a) ao Manejo'
      },
      { attempts: 3 }
    )
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
        Kue.dispatch(
          EnviaEmail.key,
          {
            data: usuario,
            layout: 'senha_alterada',
            assunto: 'Aviso modificação de senha - Manejo'
          },
          { attempts: 3 }
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
