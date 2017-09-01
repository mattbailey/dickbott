const SlackBot = require('slackbots')

const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: process.env.BOT_NAME,
})

global.DEBUG = false
global.BOT_CHANNEL = process.env.BOT_CHANNEL || 'bot-debug'

// Enumerate handlers in sets under their message event name
const handlers = new Map([
  [
    'desktop_notification',
    new Set([
      require('./handlers/desktop_notification/bounce.js'),
      require('./handlers/desktop_notification/debug.js'),
    ]),
  ],
])

bot.on('start', () => {
  bot.postMessageToChannel(global.BOT_CHANNEL, `PARTY TIME :partyparrot:`, {
    icon_emoji: ':partyparrot:',
  })
})

bot.on('message', msg => {
  if (global.DEBUG && msg.username !== process.env.BOT_NAME) {
    bot.postMessageToChannel(global.BOT_CHANNEL, JSON.stringify(msg))
  }
  const handlerSet = handlers.get(msg.type)
  if (handlerSet) {
    handlerSet.forEach(handler => {
      const args = handler.exp.exec(msg[handler.key])
      if (args) {
        handler.handler(bot, args, msg)
      }
    })
  }
})

bot.on('close', () => {})
