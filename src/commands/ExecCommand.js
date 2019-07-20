const Cmmand = require('../structures/Command.js')

class ExecCommand extens Command {
    constructor() {
        super('exec')
        this.name = 'Exec'
        this.category = 'Hidden'
        this.aliases = ['run', 'bash']
    }
    async run(message, args) {
        let text = args.join(' ')
        let msg = message
        if (!['485837271967465472', '268526982222970880'].some(a => message.author.id === a)) return

        const { spawn } = require('child_process')

        let a = []

        let o = await msg.channel.send('<a:ssh:602257555275776000> **|** Running... be patient!')

        let cmdarr = text.split(' ')

        let fcmd = cmdarr.shift()

        const ls = spawn(fcmd, cmdarr)

        ls.stdout.on('data', (data) => {
            if (a.length > 15) a = []

            a.push(data)

            setTimeout(() => {
                o.edit('```' + a.join('\n') + '```')
            }, 500)
        })

        ls.stderr.on('data', (data) => {
            if (a.length > 15) a = []

            a.push(data)

            setTimeout(() => {
                o.edit('```' + a.join('\n') + '```')
            }, 500)
        })

        ls.on('close', (code) => {
            if (a.length > 15) a = []

            a.push('<a:selena:529838831147417620> OK; **|** Finished with code ' + code)

            setTimeout(() => {
                o.edit('```' + a.join('\n') + '```')
            }, 500)
        })


    }
}