const { Client: DiscordClient, Collection } = require('discord.js');
const CommandContext = require('./Context');
const parseArgs = require('./util/parseArgs');
const DefaultHelpCommand = require('./DefaultHelpCommand');

class CommandClient extends DiscordClient {
  constructor(prefix, settings = {}) {
    super();
    this.settings = settings;
    this.settings.prefix = prefix;
    this.commands = new Collection();

    this.on('raw', (packet) => {
      if (packet.t !== 'READY') return;
      this.settings.cprefix = new RegExp(`^${this.settings.prefix}|^<@!?${packet.d.user.id}>`);
    });
    this.on('message', this._handleMessage.bind(this));

    this.command(DefaultHelpCommand);
  }

  /**
   * This callback is displayed as part of the Requester class.
   * @callback Command~handler
   * @param {?Error} error Any error that happened while processing the command
   * @param {CommandContext} ctx Command context
   */

  /**
   * @typedef {Object} Command
   * @prop {string} name Name of command
   * @prop {string} help Help for command
   * @prop {array} args Arguments the command will handle
   * @prop {Command~handler} handler Function to run when the command is triggered
   */

  /**
   * Register a command
   * @param  {string|Command} name Name of command or command object
   * @param  {string} [args] Arguments the command will take
   * @param  {Command~handler} handler Function to run when the command is triggered
   * @param  {string} [help] Help string
   */
  command(name, args, handler, help) {
    if (typeof name === 'object') {
      args = name.args;
      handler = name.run;
      help = name.help;
      name = name.name;
    } else if (typeof args === 'function' && !handler) {
      handler = args;
      args = '';
    }
    this.commands.set(name, {
      name,
      args: parseArgs.declaration(args),
      handler,
      help,
    });
  }

  /**
   * @param {Message} message Message
   * @private
   */
  _handleMessage(message) {
    const prefix = this.settings.cprefix;
    if (message.author.bot || !prefix || !prefix.test(message.content)) return;
    const parts = message.content.replace(prefix, '').trim().split(' ');
    const command = parts.shift().toLowerCase().trim();
    message.content = parts.join(' ');
    if (!this.commands.has(command)) return;
    const cmd = this.commands.get(command);
    const args = parseArgs.content(cmd.args, message, this);
    cmd.handler(args instanceof Error ? args : null, new CommandContext(message, cmd, args));
  }
}

module.exports = CommandClient;
