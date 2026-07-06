import { Command } from 'commander'
import { log, text, password as pwdPrompt, confirm } from '@clack/prompts'
import {
    createProject,
    getProject,
    verifySeed,
    unlockProject,
    getProjectKey,
    encryptContent,
    decryptContent,
} from '../lib/project'
import config from '../lib/config'
import { getSavedLogin } from '../lib/auth'

const projectCmd = new Command('project')

projectCmd.description('Project commands').action(projectCmd.help)

projectCmd
    .command('create')
    .description('Create a new project')
    .action(async () => {
        const logged = getSavedLogin()
        if (!logged.loggedIn) {
            log.error('Not logged in. Run `halil auth login` first.')
            process.exit(1)
        }

        const name = await text({
            message: 'Project name',
            validate: (v) => (v.length < 1 ? 'Required' : undefined),
        })
        if (typeof name !== 'string') process.exit(0)

        const description = await text({ message: 'Description (optional)' })
        if (typeof description !== 'string') process.exit(0)

        const repo = await text({
            message: 'GitHub repo (owner/repo, optional)',
        })
        if (typeof repo !== 'string') process.exit(0)

        const json = await createProject(name, repo)
        log.success('Project created!')
        log.message(`Seed phrase: ${json.seedPhrase}`)
        log.warning(
            'Save this phrase — it is the only way to decrypt project content.'
        )

        const ok = await confirm({ message: 'Have you saved it?' })
        if (!ok) process.exit(1)

        if (description) {
            await unlockProject(
                json.id as string,
                json.seedPhrase as string,
                json.seedPhraseSalt as string
            )
            const key = await getProjectKey(json.id as string)
            if (key) {
                const encrypted = await encryptContent(description, key)
                const token = config.get('accessToken') as string | undefined
                await api.projects[':projectId'].$patch(
                    {
                        param: { projectId: json.id as string },
                        json: { description: encrypted },
                    },
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                    }
                )
            }
        }
    })

projectCmd
    .command('open <projectId>')
    .description('Open a project')
    .action(async (projectId: string) => {
        const logged = getSavedLogin()
        if (!logged.loggedIn) {
            log.error('Not logged in.')
            process.exit(1)
        }

        const project = await getProject(projectId)
        const key = await getProjectKey(projectId)

        if (!key) {
            const phrase = await pwdPrompt({ message: 'Enter seed phrase' })
            if (typeof phrase !== 'string') process.exit(0)

            const ok = await verifySeed(projectId, phrase)
            if (!ok) {
                log.error('Invalid seed phrase')
                process.exit(1)
            }

            await unlockProject(projectId, phrase, project.seedPhraseSalt)
        }

        const decrypted = project.description
            ? await decryptContent(
                  project.description,
                  await getProjectKey(projectId)!
              )
            : null

        log.info(`Project: ${project.name}`)
        if (decrypted) log.message(`Description: ${decrypted}`)
        if (project.githubRepo) log.message(`Repo: ${project.githubRepo}`)
    })

export default projectCmd
