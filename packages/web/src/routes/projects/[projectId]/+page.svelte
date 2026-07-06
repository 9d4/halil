<script lang="ts">
    import api from '$lib/api'
    import { getProjectKey, decryptContent, encryptContent } from '$lib/crypto'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    let project = $state(data.project) as Record<string, unknown> & {
        id: string
        name: string
        description?: string | null
        seedPhraseSalt?: string | null
    }
    let todos = $state(data.todos)
    let seedInput = $state('')
    let locked = $state(!data.hasKey)
    let error = $state('')

    let newTodoName = $state('')
    let editingDesc = $state(false)
    let descDraft = $state('')

    async function unlock() {
        error = ''
        const res = await api.projects[':projectId']['verify-seed'].$post({
            param: { projectId: project.id },
            json: { phrase: seedInput },
        })
        if (!res.ok) {
            error = 'Invalid seed phrase'
            return
        }
        const key = await getProjectKey(
            project.id,
            seedInput,
            project.seedPhraseSalt ?? undefined
        )
        if (!key) {
            error = 'Could not derive key'
            return
        }
        locked = false
        if (project.description) {
            try {
                project.description = await decryptContent(
                    project.description,
                    key
                )
            } catch (e) {
                error =
                    'Could not decrypt description. The seed phrase may be wrong or the data is not encrypted.'
                locked = true
            }
        }
        if (locked) return
        for (const t of todos as unknown as Array<{
            items: Array<{ content?: string | null }>
        }>) {
            for (const item of t.items) {
                if (!item.content) continue
                try {
                    item.content = await decryptContent(item.content, key)
                } catch {
                    item.content = '[undecryptable]'
                }
            }
        }
    }

    async function updateDesc() {
        const key = await getProjectKey(project.id)
        if (!key) return
        const encrypted = await encryptContent(descDraft, key)
        const res = await api.projects[':projectId'].$patch({
            param: { projectId: project.id },
            json: { description: encrypted },
        })
        if (res.ok) {
            project.description = descDraft
            editingDesc = false
        }
    }
</script>

<h1 class="font-display text-3xl font-bold mb-2">{project.name}</h1>

{#if locked}
    <div class="max-w-sm mx-auto mt-12">
        <h2 class="text-lg font-semibold mb-2">Enter Seed Phrase</h2>
        <input
            bind:value={seedInput}
            placeholder="Paste your seed phrase"
            class="w-full p-3 border border-gray-300 rounded-lg mb-2"
        />
        {#if error}<p class="text-red-500 text-sm mb-2">{error}</p>{/if}
        <button
            onclick={unlock}
            class="w-full py-2 bg-gray-900 text-white rounded-lg">Unlock</button
        >
    </div>
{:else}
    <p class="text-gray-500 text-sm mb-4">
        {#if editingDesc}
            <input bind:value={descDraft} class="p-1 border rounded" />
            <button onclick={updateDesc} class="ml-2 text-blue-600">save</button
            >
            <button
                onclick={() => (editingDesc = false)}
                class="ml-1 text-gray-400">cancel</button
            >
        {:else}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <span
                role="button"
                tabindex="0"
                onclick={() => {
                    descDraft = project.description || ''
                    editingDesc = true
                }}
                class="cursor-pointer"
            >
                {project.description || 'No description'}
            </span>
        {/if}
    </p>

    <div class="mt-6">
        <div class="flex gap-2 mb-4">
            <input
                bind:value={newTodoName}
                placeholder="New todo"
                class="p-2 border rounded-lg flex-1"
            />
            <button class="px-4 py-2 bg-gray-900 text-white rounded-lg"
                >Add</button
            >
        </div>
        {#each todos as todo}
            <div class="border rounded-lg p-4 mb-2">
                <h3 class="font-semibold">{todo.name}</h3>
            </div>
        {/each}
    </div>
{/if}
