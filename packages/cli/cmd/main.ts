import chalk from 'chalk'
import { Command } from 'commander'
import authCmd from './auth'
import projectCmd from './project'

const VERSION = '0.0.0'

const program = new Command()

program
    .name('halil')
    .description(
        chalk.bold('Halil — 할 일 목록') + '\nSimple todo list for developers.'
    )
    .version(VERSION)
    .action(program.help)
    .addCommand(authCmd)
    .addCommand(projectCmd)
    .hook('preAction', (_, cmd) => {
        // Dont show version on help command
        if (cmd.args.includes('--help') || cmd.args.includes('-h')) return
        console.log(chalk.bold('Halil ') + chalk.dim(`v${VERSION}\n`))
    })

export default program
