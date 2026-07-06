import { Command } from 'commander'
import { log, text, password as pwdPrompt } from '@clack/prompts'
import { authLogin, authSignup, getSavedLogin } from '../lib/auth'

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

        const pwd = await pwdPrompt({ message: 'Enter your password' })
        if (typeof pwd !== 'string') process.exit(0)

        const res = await authLogin(login, pwd)
        if (!res.success) {
            log.error(res.message)
            process.exit(1)
        }
        log.success(res.message)
    })

authCmd
    .command('signup')
    .description('Create a new account')
    .action(async () => {
        const login = await text({
            message: 'Choose a username',
            validate: (v) =>
                v.length < 3 ? 'At least 3 characters' : undefined,
        })
        if (typeof login !== 'string') process.exit(0)

        const pwd = await pwdPrompt({
            message: 'Choose a password (min 6 chars)',
            validate: (v) =>
                v.length < 6 ? 'At least 6 characters' : undefined,
        })
        if (typeof pwd !== 'string') process.exit(0)

        const name = await text({ message: 'Display name (optional)' })
        if (typeof name !== 'string') process.exit(0)

        const res = await authSignup(login, pwd, name || undefined)
        if (!res.success) {
            log.error(res.message)
            process.exit(1)
        }
        log.success(res.message)

        const autoLogin = await text({ message: 'Log in now? (Y/n)' })
        if (autoLogin === '' || autoLogin?.toLowerCase() === 'y') {
            const loginRes = await authLogin(login, pwd)
            if (loginRes.success) log.success(loginRes.message)
        }
    })

export default authCmd
