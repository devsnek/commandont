const {
  USERS_PATTERN,
  ROLES_PATTERN,
  CHANNELS_PATTERN,
} = require('discord.js').MessageMentions;

function declaration(str) {
  return (str.match(/(<.+?>)|(\[.+?])/g) || [])
    .map((m) => {
      const required = m.startsWith('<') && m.endsWith('>');
      const raw = m.replace(/[<>[\]]/g, '');
      let [name, type] = raw.split(':').map((x) => x.trim());
      const rest = name.endsWith('...');
      if (rest) name = name.slice(0, -3);
      return { required, name, type, rest, raw: `${required ? '<' : '['}${name}: ${type}${required ? '>' : ']'}` };
    });
}

function content(args, message, client) {
  const consumableArgs = Object.assign([], args);
  const output = {};
  let items = message.content.split(' ');
  while (consumableArgs.length) {
    const { name, rest, type, required } = consumableArgs.shift();
    let text = rest ? items.shift().trim() : items.join(' ').trim();
    if (!text && required) return new Error(`Required argument "${name}" was not passed`);
    if (type) {
      switch (type) {
        case 'Member': {
          const match = USERS_PATTERN.exec(text);
          output[name] = match && message.guild ? message.guild.member(match[1]) : null;
          break;
        }
        case 'Role': {
          const match = ROLES_PATTERN.exec(text);
          output[name] = match && message.guild ? message.guild.roles.get(match[1]) : null;
          break;
        }
        case 'User': {
          const match = USERS_PATTERN.exec(text);
          output[name] = match ? client.users.get(match[1]) : null;
          break;
        }
        case 'Channel': {
          const match = CHANNELS_PATTERN.exec(text);
          output[name] = match ? client.channels.get(match[1]) : null;
          break;
        }
        case 'Command':
          output[name] = client.commands.get(text.toLowerCase()) || null;
          break;
      }
    } else {
      output[name] = text;
    }
  }
  return output;
}

module.exports = {
  declaration,
  content,
};
