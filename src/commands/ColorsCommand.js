const Command = require('../structures/Command.js')

class ColorsCommand extends Command {
  constructor () {
    super('colors')
    this.name = 'Colors'
    this.catrgory = 'dev'
    this.aliases = ['palette']
  }
  async run (message, args) {
    async function detectProperties () {
      const vision = require('@google-cloud/vision')
      const client = new vision.ImageAnnotatorClient()
      const [result] = await client.imageProperties(require(process.cwd() + '/assets/lorde.jpg'))
      const colors = result.imagePropertiesAnnotation.dominantColors.colors
      colors.forEach(color => message.channel.send(color))
    }
    detectProperties()
  }
}

module.exports = ColorsCommand
