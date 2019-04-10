'use strict'

const Env = use('Env')
const Mail = use('Mail')

class EnviaEmail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'EnviaEmail-job'
  }

  // This is where the work is done.
  async handle ({ data, layout, assunto }) {
    Mail.send([`emails.${layout}`], data, message => {
      message
        .to(data.email)
        .from(
          Env.get('MAIL_NAO_RESPONDER'),
          Env.get('MAIL_NAO_RESPONDER_APRESENTACAO')
        )
        .subject(assunto)
    })
  }
}

module.exports = EnviaEmail
