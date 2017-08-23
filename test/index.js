const Commandont = require('../');
const { token } = require('./auth');

const client = new Commandont.CommandClient('t!');

client.on('ready', () => {
  console.log('Ready', client.user.tag); // eslint-disable-line no-console
});

client.on('debug', console.info); // eslint-disable-line no-console

client.command('ping', (err, ctx) => ctx.reply('pong!')); // eslint-disable-line handle-callback-err
client.command('avatar', '<subject:User>', (err, ctx) => {
  if (err) ctx.reply(err.message);
  else ctx.reply(ctx.args.subject.avatarURL());
});
client.command(require('./commandInFile'));

client.login(token);
