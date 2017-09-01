const figlet = require('figlet')

const fg = ':dong:'
const bg = '⬜'

module.exports = {
  key: 'text',
  exp: /<@(\S+)> dongify (.+)/,
  handler: async (bot, args, msg) => {
    if (args[1] === global.BOT_ID && args[2]) {
      const art = figlet
        .textSync(args[2].slice(0, 10), 'hashabet')
        .replace(/ /g, bg)
        .replace(/#/g, fg)
      const output = `\u2063\n${art}`

      bot.postMessage(msg.channel, output)
    }
  },
}
