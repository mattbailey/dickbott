var sqlite3 = require('sqlite3')

var triggers = {}
var insults = []
var adjectives = []
var adverbs = []
var verbs = []
var gerunds = []
var actions = { AT:"triggers", AI:"insults", AV:"verbs", AJ:"adjectives", AD:"adverbs", AG:"gerunds" }

/* You can test this outside of slack like:
   `npm install prompt`
   `node insults.js`
   and uncomment the localTesting flag

var prompt = require('prompt')
prompt.start()
prompt.get(['query'], (err, result) => {
  var query = result.query.toUpperCase()
  var trigger = query.split(' ')[0]
  console.log("trigger is "+trigger)

  if(trigger in triggers){
    console.log(buildMessage(triggers[trigger.toUpperCase()]))
  }

  var content = query.split(/ (.+)/)[1]
  if (trigger in actions){
    console.log(addThing(actions[trigger], content))
  }

  if (trigger.match('GREP')) {
    console.log("grep query is "+query)
    console.log(grepLexicon(query))
  }
})
*/

var openDB = () => { 
  return new sqlite3.Database('./lib/handlers/message/data/wordlist.sql')
}

var addThing = (target, content) => {
  if (content.match(/;/)) {
    return "Invalid character detected -- aborted."
  }

  content = content.toUpperCase().trim()

  var db = openDB()

  if (target != "triggers") {
    var sql = "INSERT INTO "+target+"(word) VALUES(?)"
    db.run(sql, [content], function(err) {
      if (err) {
        return err.message
      }
      // rather than clear & re-cache data from sql, let's just append the object
      lexicon[target].push(content)
    })
  }else{
    if (!content.match(/:/))
      return "Correct format: ai trigger : template (with $variables)"

    var key = content.split(/:(.+)/)[0].toUpperCase().trim()
    var template = content.split(/:(.+)/)[1].toUpperCase().trim()

    var sql = "INSERT INTO triggers(trigger, template) VALUES(?,?)"
    db.run(sql, [key, template], function(err) {
      if (err) {
        return err.message
      }
      triggers[key] = template
    })
  }

  db.close()

  return "Okie doke. You might wanna check STATS or GREP to verify."
}

// go off and cache all the sqlite stuff to js
var cacheData = () => {
  var db = openDB()

  db.all("SELECT word FROM insults", (err, data) => {
    data.forEach((row) => {
      insults.push(row.word)
    })
  })

  db.all("SELECT word FROM adjectives", (err, data) => {
    data.forEach((row) => {
      adjectives.push(row.word)
    })
  })

  db.all("SELECT word FROM adverbs", (err, data) => {
    data.forEach((row) => {
      adverbs.push(row.word)
    })
  })

  db.all("SELECT word FROM verbs", (err, data) => {
    data.forEach((row) => {
      verbs.push(row.word)
    })
  })


  db.all("SELECT word FROM gerunds", (err, data) => {
    data.forEach((row) => {
      gerunds.push(row.word)
    })
  })

  db.all("SELECT trigger, template FROM triggers", (err, data) => {
    data.forEach((row) => {
      triggers[row.trigger] = row.template
    })
  })

  db.close() 
}

cacheData()

var lexicon = {
  insults: insults,
  adjectives: adjectives,
  adverbs: adverbs,
  verbs: verbs,
  gerunds: gerunds,
}

var randomThing = thing => lexicon[thing][Math.floor(Math.random() * lexicon[thing].length)]

var buildMessage = text => {
  if (!text.match(/\$/)) {
    return text + " " + randomThing('insults')
  }

  // replace every placeholder var as long as there are placeholder vars present.
  while (text.match(/\$insult|\$gerund|\$adjective|\$adverb|\$verb/i)) {
    if (text.match(/\$insult/i)) {
      text = text.replace(/\$insult/i, randomThing('insults'))
    }

    if (text.match(/\$adjective/i)) {
      text = text.replace(/\$adjective/i, randomThing('adjectives'))
    }

    if (text.match(/\$adverb/i)) {
      text = text.replace(/\$adverb/i, randomThing('adverbs'))
    }

    if (text.match(/\$gerund/i)) {
      text = text.replace(/\$gerund/i, randomThing('gerunds'))
    }

   if (text.match(/\$verb/i)) {
      text = text.replace(/\$verb/i, randomThing('verbs'))
    }
  }

  return text

}

var grepLexicon = query => {
  var re = new RegExp(query, 'gi')

  // for triggers we check both the key and the value
  var results = "*triggers*: "
  var resultCnt = 0
  for (trigger of Object.keys(triggers)) {
    if (trigger.match(re)) { results += trigger + ", "; ++resultCnt }
    if (triggers[trigger].match(re)) { results += triggers[trigger] + ", "; ++resultCnt}
  }
  if (resultCnt > 0)
    results = trimTrailingComma(results)
  else
    results += "none. "

  resultCnt = 0

  // for the rest of the lexicon, they are 1d arrays, so just iterate the collection
  for (wordType of Object.keys(lexicon)) {
    results += "*"+wordType+"*: "
    for (value of lexicon[wordType]) {
      if (value.match(re)) { results += value + ", "; ++resultCnt }
    }
    if (resultCnt > 0)
      results = trimTrailingComma(results)
    else
      results += "none. "

    resultCnt = 0
  }

  return results
}

var trimTrailingComma = str => str.replace(/, $/, " ")

var getStatistics = () => 
  randomThing('adjectives') + ' STATS: ' + insults.length + ' INSULTS, ' + verbs.length + ' VERBS, ' + adjectives.length + ' ADJECTIVES, ' + adverbs.length + ' ADVERBS, ' + gerunds.length + ' GERUNDS, AND ' + Object.keys(triggers).length + ' TRIGGERS'

module.exports = {
  key: 'text',
  exp: /\.(\S+)/,
  handler: async (bot, args, msg) => {
    var trigger = args[1].toUpperCase()

    if (trigger === 'HELP') {
      bot.postMessage(msg.channel, "List of triggers: https://pastebin.com/aNC0mAVx || grep <thing> -- find <thing> in the lexicon. || stats -- print some statistics || at -- add trigger, ai -- add insult, av -- add verb, ad -- add adverb, aj -- add adjective, ag -- add gerund")
    }

    if (trigger === 'STATS') {
      bot.postMessage(msg.channel, getStatistics())
    }

    if (trigger === 'GREP') {
      var query = msg.text.split(' ')

      bot.postMessage(msg.channel, grepLexicon(query[1]))
    }

    if (trigger in actions){
      var content = msg.text.split(/ (.+)/)[1]
      bot.postMessage(msg.channel, addThing(actions[trigger], content)) 
    }

    if (trigger in triggers) {
      var response = buildMessage(triggers[trigger])
      if (trigger === 'UR') {
        response = response.toLowerCase()
      }
      bot.postMessage(msg.channel, response)
   }
  },
}
