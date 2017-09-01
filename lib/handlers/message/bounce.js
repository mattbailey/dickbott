module.exports = {
  key: 'text',
  exp: /@(\S+) bounce/,
  handler: async (bot, args) => {
    if (args[1] === global.BOT_NAME) {
      await bot.postMessageToChannel(
        global.BOT_CHANNEL,
        'DISCONNECTING :sadparrot:',
        {
          icon_emoji: ':sadparrot:',
        },
      )
      process.exit(0)
    }
  },
}
