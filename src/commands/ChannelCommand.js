const Command = require('../structures/Command')

class ChannelCommand extends Command {
  constructor () {
    super('channel')
    this.category = 'Gerenciamento do servidor'
    this.usage = ''
    this.memberPermissions = ['MANAGE_CHANNELS']
  }

  async run (message, args, { t }) {
    if (!args[0]) return message.reply('/`rename`/`create`')
    /* if (args[0] === 'rename-all') {
      message.channel.send('⚠ – Atenção!\nEssa operação irá renomear **__TODOS__** os canais, tirando respectivamente seus traços (`-`) e colocando um espaço.\nDeseja continuar? (Sim)')
      const filter = m => ((m.content.startsWith('Sim') || m.content.startsWith('sim') || m.content.startsWith('Yes') || m.content.startsWith('yes')) && m.author.id === message.author.id)
      return message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
      })
        .then(collected => message.channel.send('🔠 – Trocando nomes...') && message.guild.channels.forEach(a => a.setName(a.name.replace('/-/g', '\u2006'))))
        .catch(collected => message.channel.send('❌ – Você pensou demais e o tempo acabou.'))
    } */
    if (args[0] === 'rename') {
      let channel = message.mentions.channels.first() || message.guild.channels.get(args[1])
      if (!channel) return message.reply(t('commands:channel.invalid'))
      if (!args[2]) return message.reply(t('commands:channel.noArgs'))
      /* if (args[2] === '--') return channel.setName(channel.name.replace('/-/g', '\u2006')) */
      return channel.setName(args.slice(2).join('\u2006')).then(channel => message.reply(t('commands:channel.renamedTo', { channel: channel.name })))
    }
    if (args[0] === 'create') return message.guild.createChannel(args.slice(1).join('\u2006'), 'text').then(channel => message.reply(t('commands:channel.created', { channel: channel.name })))
  }
}

module.exports = ChannelCommand
