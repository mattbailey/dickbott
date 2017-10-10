var triggers = require('./data/triggers.json')
var adjectives = require('./data/adjectives.json')
var adverbs = require('./data/adverbs.json')
var insults = require('./data/insults.json')
var verbs = require('./data/verbs.json')
var gerunds = require('./data/gerunds.json')

var lexicon = { 
  "insults" : insults, 
  "adjectives" : adjectives, 
  "adverbs" : adverbs, 
  "insults" : insults, 
  "verbs" : verbs, 
  "gerunds" : gerunds 
}

/* You can test this outside of slack like:
   `npm install prompt`
   `node insults.js`
   and uncomment the rest of this.
var prompt = require('prompt');
prompt.start();
prompt.get(['trigger'], function(err, result) {
  var trigger = result.trigger.toUpperCase();
  if(trigger in triggers){
    buildMessage(triggers[trigger.toUpperCase()]);
  }
});
*/

randomThing = function(thing) {
  var rand = Math.floor(Math.random() * lexicon[thing].length);
  return lexicon[thing][rand];
}

buildMessage = function(text) {
  if (!text.match(/\$/)) {
    return text + " " + randomThing('insults');
  }

  // replace every placeholder var as long as there are placeholder vars present.
  while (text.match(/\$insult|\$gerund|\$adjective|\$adverb|\$verb/i)) {
    if (text.match(/\$insult/i)) {
      text = text.replace(/\$insult/i, randomThing('insults'));
    }

    if (text.match(/\$adjective/i)) {
      text = text.replace(/\$adjective/i, randomThing('adjectives'));
    }

    if (text.match(/\$adverb/i)) {
      text = text.replace(/\$adverb/i, randomThing('adverbs'));
    }

    if (text.match(/\$gerund/i)) {
      text = text.replace(/\$gerund/i, randomThing('gerunds'));
    }

   if (text.match(/\$verb/i)) {
      text = text.replace(/\$verb/i, randomThing('verbs'));
    }
  }

  return text;

}

getStatistics = function() {
  return randomThing('adjectives') + ' STATS: ' + insults.length + ' INSULTS, ' + verbs.length + ' VERBS, ' + adjectives.length + ' ADJECTIVES, ' + adverbs.length + ' ADVERBS, ' + gerunds.length + ' GERUNDS, AND ' + Object.keys(triggers).length + ' TRIGGERS';
}

module.exports = {
  key: 'text',
  exp: /\.(\S+)/,
  handler: async (bot, args, msg) => {
    var trigger = args[1].toUpperCase();

    if (trigger === 'HELP') {
      bot.postMessage(msg.channel, "List of triggers (last updated Oct 5 '17): https://pastebin.com/aNC0mAVx");
    }

    if (trigger === 'STATS') {
      bot.postMessage(msg.channel, getStatistics());
    }

    if(trigger in triggers) {
      var response = buildMessage(triggers[trigger]);
      if (trigger === 'UR') {
        response = response.toLowerCase();
      }
      bot.postMessage(msg.channel, response);
    }
  },
}
