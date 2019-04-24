'use strict'

const Route = use('Route')

// CRIAÇÃO DE USUARIO
Route.post('usuario', 'UsuarioController.store').validator('Usuario')
// LOGIN / BUSCANDO TOKEN
Route.post('login', 'LoginController.login').validator('Login')
// VALIDA USUÁRIO E TROCA PARA UMA SENHA TEMPORÁRIA
Route.post('esqueceu_senha', 'EsqueceuSenhaController.store').validator(
  'EsqueceuSenha'
)

Route.group(() => {
  // UPDATE SOMENTE QUANDO LOGADO
  Route.put('usuario', 'UsuarioController.update').validator('UsuarioUpdate')
  // TODAS AS ROTAS POSSIVEIS PARA TRANSAÇÕES QUANDO USER ESTIVER LOGADO
  Route.resource('transacoes', 'TransacoesController')
    .apiOnly()
    .except(['show'])
}).middleware(['auth'])
