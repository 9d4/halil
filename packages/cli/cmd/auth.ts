import { Command } from 'commander'
import { log, text } from '@clack/prompts'
import api from '../lib/api'

const authCmd = new Command('auth')

authCmd.description('Authentication commands').action(authCmd.help)

authCmd
    .command('login')
    .description('Log in to your account')
    .action(async () => {
        const login = await text({ message: 'Enter your username' })
        if (typeof login !== 'string') process.exit(0)

        log.info(`Logging in as ${String(login)}...`)
        const res = await api.auth.login.$post({
            json: { login },
        })
        if (!res.ok) {
            const json = await res.json()
            log.error(`Login failed: ${res.status} ${json.message}`)
        }

        log.success(`Logged in successfully!`)
    })

export default authCmd
