module.exports = {
  key: 'text',
  exp: /<@(\S+)> debug/,
  handler: async (bot, args) => {
    if (args[1] === global.BOT_ID) {
      global.DEBUG = !global.DEBUG
      await bot.postMessageToChannel(
        global.BOT_CHANNEL,
        `DEBUG: ${global.DEBUG}`,
      )
      setTimeout(() => {
        global.DEBUG = false
        bot.postMessageToChannel(
          global.BOT_CHANNEL,
          `1m debug timer hit, DEBUG: ${global.DEBUG}`,
        )
      }, 60000)
    }
  },
}
