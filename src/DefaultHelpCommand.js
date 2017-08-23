const unindent = require('./util/unindent');

module.exports = {
  name: 'help',
  args: '[command: Command]',
  help: 'Get info about this bot or one of its commands',
  run(err, ctx) {
    if (err) return ctx.reply('Error while providing help!');
    if (ctx.args.command) {
      const command = ctx.args.command;
      ctx.reply(unindent`
        Command Help: ${command.name}
        Arguments: ${command.args.map((a) => a.raw).join(' ')}
        ${command.help || ''}
      `.trim());
    } else {
      ctx.reply('Bot Help:');
    }
  },
};
