import { describe } from 'bun:test'
import { readMarkdown } from './markdown'

describe('markdown module', async () => {
    const testFilePath = new URL('../testdata/simple.md', import.meta.url)
    const simple = await Bun.file(testFilePath).text()
    const data = readMarkdown(simple)
    console.log(JSON.stringify({ data }, null, 2))
})
