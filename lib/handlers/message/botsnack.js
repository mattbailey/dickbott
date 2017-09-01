module.exports = {
  key: 'text',
  exp: /@(\S+) botsnack/,
  handler: async (bot, args, msg) => {
    if (args[1].value === global.BOT_NAME) {
      const channel = await getChannel(msg.channel)
      bot.postMessageToChannel(channel, `@${msg.username} nomnomnom :hamburger:`, {
        icon_emoji: ':sadparrot:',
      })
    }
  },
}
