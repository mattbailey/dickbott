module.exports = {
  key: 'content',
  exp: /(\S+): @(\S+) debug/,
  handler: async bot => {
    global.DEBUG = !global.DEBUG
    await bot.postMessageToChannel(global.BOT_CHANNEL, `DEBUG: ${global.DEBUG}`)
    setTimeout(() => {
      global.DEBUG = false
      bot.postMessageToChannel(global.BOT_CHANNEL, `1m debug timer hit, DEBUG: ${global.DEBUG}`)
    }, 60000)
  },
}
