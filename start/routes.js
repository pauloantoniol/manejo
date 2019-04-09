'use strict'

const Route = use('Route')

// CRIAÇÃO DE USUARIO
Route.post('usuario', 'UsuarioController.store').validator('usuario')
// LOGIN / BUSCANDO TOKEN
Route.post('login', 'LoginController.login').validator('Login')
// VALIDA USUÁRIO E TROCA PARA UMA SENHA TEMPORÁRIA
Route.post('esqueceu_senha', 'EsqueceuSenhaController.store').validator(
  'EsqueceuSenha'
)

Route.group(() => {
  // UPDATE SOMENTE QUANDO LOGADO
  Route.put('usuario', 'UsuarioController.update')
}).middleware(['auth'])
