const Command = require('../structures/Command')
//const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
//const { IamAuthenticator } = require('ibm-watson/auth')

class AnalyzeTextCommand extends Command {
  constructor () {
    super('analyzetext')
  }
  async run (message, args, { t }) {
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-12',
      authenticator: new IamAuthenticator({
        apikey: '8KB8TsoX7pePVHJX7b8Z-SLUpAkplhNn8t7BLUFNLjLH'
      }),
      text: args.join(' ')
    })

    const analyzeParams = {
      'text': args.join(' '),
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'fear': true,
          'limit': 2
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'fear': true
        }
      }
    }

    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        let ready = analysisResults.result.keywords[0].emotion
        if (!analysisResults.result.keywords[0]) return message.reply(t('commands:analyzeText.invalid'))
        if (!ready.sadness) return message.reply(t('commands:analyzedText.invalud'))
        message.channel.send(t('commands:analyzeText.text', { text: args.join(' ') }))
        message.channel.send(t('commands:analyzeText.analyzed', { sadness: ready.sadness, joy: ready.joy, fear: ready.fear, anger: ready.anger, disgust: ready.disgust }))
      })
      .catch(err => console.log(err))
  }
}

module.exports = AnalyzeTextCommand
