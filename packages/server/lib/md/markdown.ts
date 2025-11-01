import { marked } from 'marked'

export function readMarkdown(text: string) {
    return marked.lexer(text, { gfm: true })
}
