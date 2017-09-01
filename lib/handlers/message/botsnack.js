/* Example message shape:
  {
    type: 'message',
    channel: 'C6WB4NSBT',
    user: 'U07FW5ZPX',
    text: '<@U6WQ2F7DJ> botsnack',
    ts: '1504294716.000184',
    source_team: 'T04G3HSDP',
    team: 'T04G3HSDP'
  }
*/

module.exports = {
  key: 'text',
  exp: /<@(\S+)> botsnack/,
  handler: async (bot, args, msg) => {
    if (args[1] === global.BOT_ID) {
      bot.postMessage(msg.channel, `<@${msg.user}> nomnomnom :hamburger:`)
    }
  },
}
