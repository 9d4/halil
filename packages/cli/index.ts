import { program } from 'commander'

program
    .name('halil')
    .description('Halil — Simple todo list for developers.')
    .version('0.0.0')
    .action(program.help)

program.parse(process.argv)
