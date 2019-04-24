'use strict'

const empty = require('is-empty')
const Transacoes = use('App/Models/Transacoes')

class TransacoesController {
  async _total ({ registros, tela }) {
    let total = 0
    registros.map((transacao, index) => {
      let { tipo, valor, executado } = transacao['$attributes']
      if (executado) {
        switch (tipo) {
          case 'D':
            if (tela != 'R') {
              total -= valor
            }
            break
          case 'R':
            if (tela != 'D') {
              total += valor
            }
            break
        }
      }
    })

    return Number(total.toFixed(2))
  }

  /**
   * Show a list of all transacoes.
   * GET transacoes
   */
  async index ({ request, auth }) {
    const { id } = auth.user
    const data_hoje = new Date()
    const _mes = data_hoje.getMonth() + 1
    const _ano = data_hoje.getFullYear()

    let { tela, mes, ano } = request._qs
    tela = !empty(tela) ? tela : '%'
    mes = !empty(mes) ? mes : _mes
    ano = !empty(ano) ? ano : _ano

    const data_ditada = new Date(ano, mes, 0)
    const ultimo_dia = data_ditada.getDate()

    const transacoes = await Transacoes.query()
      .where('usuario_id', id)
      .andWhere('tipo', 'like', tela)
      .whereBetween('transacao_data', [
        `${ano}-${mes}-${1}`,
        `${ano}-${mes}-${ultimo_dia}`
      ])
      .fetch()
    const registros = transacoes.rows
    const total = await this._total({ registros, tela })
    return { registros, total }
  }

  /**
   * Create/save a new transacao.
   * POST transacoes
   */
  async store ({ request, auth }) {
    const data = request.only([
      'transacao_data',
      'tipo',
      'nome',
      'valor',
      'executado'
    ])
    const transacao = await Transacoes.create({
      ...data,
      usuario_id: auth.user.id
    })
    return transacao
  }

  /**
   * Update transacao details.
   * PUT or PATCH transacoes/:id
   */
  async update ({ params, request }) {
    const data = request.only(['transacao_data', 'nome', 'valor', 'executado'])
    const transacao = await Transacoes.findOrFail(params.id)
    transacao.merge(data)
    await transacao.save()
    return transacao
  }

  /**
   * Delete a transacoe with id.
   * DELETE transacoes/:id
   */
  async destroy ({ params }) {
    const transacao = await Transacoes.findOrFail(params.id)
    await transacao.delete()
  }
}

module.exports = TransacoesController
