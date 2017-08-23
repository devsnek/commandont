class Context {
  constructor(message, command, args) {
    /**
     * Message for this context
     * @type {Message}
     */
    this.message = message;

    /**
     * Command that triggered this context
     * @type {Command}
     */
    this.command = command;

    /**
     * Arguments for this context
     * @type {Object}
     */
    this.args = args instanceof Error ? null : args;
  }

  /**
   * Reply with the given context
   * @param  {*} args Arguments
   * @returns {Promise<Message>}
   */
  reply(...args) {
    return this.message.reply(...args);
  }
}

module.exports = Context;
