'use strict'

const generator = require('generate-password')
const Usuario = use('App/Models/Usuario')
const Kue = use('Kue')
const EnviaEmail = use('App/Jobs/EnviaEmail')

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

      Kue.dispatch(
        EnviaEmail.key,
        {
          data: {
            email: usuario.email,
            nova_senha,
            link: ``
          },
          layout: 'esqueceu_senha',
          assunto: 'Recuperação de senha - Manejo'
        },
        { attempts: 3 }
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
