import { Command } from 'commander'
import { log, text } from '@clack/prompts'
import { authLogin, getSavedLogin } from '../lib/auth'

const authCmd = new Command('auth')

authCmd.description('Authentication commands').action(authCmd.help)

authCmd
    .command('login')
    .description('Log in to your account')
    .action(async () => {
        const logged = getSavedLogin()
        if (logged.loggedIn) {
            log.info(`Already logged in as ${logged.login}.`)
            return
        }

        const login = await text({ message: 'Enter your username' })
        if (typeof login !== 'string') process.exit(0)

        const res = await authLogin(login)
        if (!res.success) {
            log.error(res.message)
            process.exit(1)
        }
        log.success(res.message)
    })

export default authCmd
