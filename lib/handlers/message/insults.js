
var sqlite3 = require('sqlite3')

var triggers = {}
var insults = []
var adjectives = []
var adverbs = []
var verbs = []
var gerunds = []

// go off and cache all the sqlite stuff to js
var cacheData = () => {
  var db = new sqlite3.Database('./data/wordlist.sql')

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

/* You can test this outside of slack like:
   `npm install prompt`
   `node insults.js`
   and uncomment the rest of this.

var prompt = require('prompt')
prompt.start()
prompt.get(['trigger'], (err, result) => {
  var trigger = result.trigger.toUpperCase()

  if(trigger in triggers){
    console.log(buildMessage(triggers[trigger.toUpperCase()]))
  }
})


   */

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

var getStatistics = () => 
  randomThing('adjectives') + ' STATS: ' + insults.length + ' INSULTS, ' + verbs.length + ' VERBS, ' + adjectives.length + ' ADJECTIVES, ' + adverbs.length + ' ADVERBS, ' + gerunds.length + ' GERUNDS, AND ' + Object.keys(triggers).length + ' TRIGGERS'

var buildMessage = text => {
  console.log('in buildmessage text is '+text)
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

module.exports = {
  key: 'text',
  exp: /\.(\S+)/,
  handler: async (bot, args, msg) => {
    var trigger = args[1].toUpperCase()

    if (trigger === 'HELP') {
      bot.postMessage(msg.channel, "List of triggers (last updated Oct 5 '17): https://pastebin.com/aNC0mAVx")
    }

    if (trigger === 'STATS') {
      bot.postMessage(msg.channel, getStatistics())
    }

    if(trigger in triggers) {
      var response = buildMessage(triggers[trigger])
      if (trigger === 'UR') {
        response = response.toLowerCase()
      }
      bot.postMessage(msg.channel, response)
   }
  },
}
