const SlackBot = require('slackbots')
const fs = require('fs')

const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: process.env.BOT_NAME,
})

global.BOT_RELEASE = fs.existsSync('./BOT_RELEASE')
  ? fs.readFileSync('./BOT_RELEASE').toString()
  : 'dev'
global.DEBUG = false
global.BOT_CHANNEL = process.env.BOT_CHANNEL || 'bot-debug'
global.BOT_NAME = process.env.BOT_NAME

// Enumerate handlers in sets under their message event name
const handlers = new Map([
  [
    'message',
    new Set([
      require('./handlers/message/bounce.js'),
      require('./handlers/message/debug.js'),
      require('./handlers/message/botsnack.js'),
      // require('./handlers/message/dongify.js'),
    ]),
    'desktop_notification',
    new Set([require('./handlers/desktop_notification/bounce.js')]),
  ],
])

bot.on('start', async () => {
  global.BOT_ID = await bot.getUserId(global.BOT_NAME)
  bot.postMessageToChannel(
    global.BOT_CHANNEL,
    `:partyparrot: starting up from commit: ${BOT_RELEASE} id: ${global.BOT_ID}`,
    { icon_emoji: ':partyparrot:' },
  )
})

bot.on('message', msg => {
  if (global.DEBUG && msg.username !== process.env.BOT_NAME) {
    bot.postMessageToChannel(global.BOT_CHANNEL, JSON.stringify(msg))
  }
  const handlerSet = handlers.get(msg.type)
  //console.log(handlerSet)
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
