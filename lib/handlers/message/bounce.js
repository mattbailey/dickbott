module.exports = {
  key: 'text',
  exp: /@(\S+) bounce/,
  handler: async bot => {
    await bot.postMessageToChannel(global.BOT_CHANNEL, 'DISCONNECTING :sadparrot:', {
      icon_emoji: ':sadparrot:',
    })
    process.exit(0)
  },
}
