const figlet = require('figlet')

const fg = ':dong:'
const bg = ':spacer:'

const WIDTH = 10
const MAX_LINES = 3

function pullLine(words) {
  const line = []
  let chars = 0

  while (words.length > 0) {
    chars = chars + words[0].length + (line.length - 1)
    if (chars < WIDTH) {
      line.push(words.shift())
    } else {
      break
    }
  }

  return line.join(' ')
}

function split(input) {
  let words = input.split(' ').map(word => word.slice(0, 10))
  let lines = []

  let lineCount = 0
  while (words.length > 0 && lineCount++ < MAX_LINES) {
    lines.push(pullLine(words))
  }
  return lines
}

function dongify(line) {
  return figlet
    .textSync(line.toUpperCase(), 'hashabet')
    .split('\n')
    .slice(0, -2)
    .join('\n')
    .replace(/ /g, bg)
    .replace(/#/g, fg)
}

module.exports = {
  key: 'text',
  exp: /<@(\S+)> dongify (.+)/,
  handler: async (bot, args, msg) => {
    if (args[1] === global.BOT_ID && args[2]) {
      const lines = split(args[2])
      for (const line of lines) {
        const dongs = dongify(line)
        await bot.postMessage(msg.channel, dongs)
      }
    }
  },
}
