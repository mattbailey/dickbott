const figlet = require('figlet');

const fg = ':dong:'
const bg = '⬜';

module.exports = {
    key: 'text',
    exp: /<@(\S+)> dongify (.+)/,
    handler: async (bot, args, msg) => {
        if (args[1] === global.BOT_ID && args[2]) {
            let art = figlet.textSync(args[2], 'hashabet');
            art = art.replace(/ /g, fg);
            art = art.replace(/#/g, bg);
            const output = '```\u2063```\n' + art

            bot.postMessage(msg.channel, output)
        }
    },
}
