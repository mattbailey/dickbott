const fs = require('fs')
const db = require('sqlite')

const triggers = require('./lib/handlers/message/data/triggers.json')

db.open('./wordlist.sqlite3', { Promise }).then(() => {
  Object.keys(triggers).forEach(key => {
    db.run('insert into triggers (trigger, template) values (?, ?)', [
      key,
      triggers[key],
    ])
  })
})
