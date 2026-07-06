<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation'
    import api from '$lib/api'
    import { unlockProject, encryptContent } from '$lib/crypto'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    let showModal = $state(false)
    let newSeedPhrase = $state('')
    let newProjectId = $state('')
    let newProjectSalt = $state('')
    let newProjectName = $state('')
    let newProjectDesc = $state('')
    let newProjectRepo = $state('')
    let creating = $state(false)

    async function createProject() {
        creating = true
        const res = await api.projects.$post({
            json: { name: newProjectName, githubRepo: newProjectRepo },
        })
        if (res.status === 201) {
            const json: Record<string, unknown> = await res.json()
            newSeedPhrase = json.seedPhrase as string
            newProjectId = json.id as string
            newProjectSalt = json.seedPhraseSalt as string
            showModal = true
            newProjectName = ''
            newProjectRepo = ''
        }
        creating = false
    }

    async function closeModal() {
        if (newProjectDesc && newProjectId && newProjectSalt && newSeedPhrase) {
            const key = await unlockProject(
                newProjectId,
                newSeedPhrase,
                newProjectSalt
            )
            const encrypted = await encryptContent(newProjectDesc, key)
            await api.projects[':projectId'].$patch({
                param: { projectId: newProjectId },
                json: { description: encrypted },
            })
            newProjectDesc = ''
        }
        showModal = false
        await invalidateAll()
    }
</script>

<h1 class="font-display text-4xl font-bold mb-4">Projects</h1>
<p class="font-serif">Place where we can organize our projects.</p>

<div class="mt-6 flex gap-2">
    <input
        bind:value={newProjectName}
        placeholder="Project name"
        class="p-2 border border-gray-300 rounded-lg"
    />
    <input
        bind:value={newProjectDesc}
        placeholder="Description"
        class="p-2 border border-gray-300 rounded-lg"
    />
    <input
        bind:value={newProjectRepo}
        placeholder="owner/repo"
        class="p-2 border border-gray-300 rounded-lg"
    />
    <button
        onclick={createProject}
        disabled={creating}
        class="px-4 py-2 bg-gray-900 text-white rounded-lg"
    >
        {creating ? 'Creating…' : 'Create'}
    </button>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    {#each data.projects as project}
        <button
            class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
            onclick={() => goto(`projects/${project.id}`)}
        >
            <h3 class="font-display text-xl font-semibold text-gray-800 mb-2">
                {project.name}
            </h3>

            {#if project.githubRepo}
                <p class="text-gray-600 text-sm">
                    <a
                        href={`https://github.com/${project.githubRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-gray-500 hover:text-gray-700 underline"
                        onclick={(e) => e.stopPropagation()}
                    >
                        {project.githubRepo}
                    </a>
                </p>
            {/if}
        </button>
    {/each}
</div>

{#if showModal}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        role="button"
        tabindex="0"
        onclick={closeModal}
        onkeydown={(e) => e.key === 'Enter' && closeModal()}
    >
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions a11y_no_noninteractive_element_interactions -->
        <div
            class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
            role="document"
            onclick={(e) => e.stopPropagation()}
            onkeydown={() => {}}
        >
            <h2 class="text-xl font-bold mb-2">Project Created</h2>
            <p class="text-sm text-gray-500 mb-4">
                Save this seed phrase. It is the only way to decrypt project
                content.
            </p>
            <div
                class="bg-gray-100 rounded-lg p-4 text-center text-lg font-mono tracking-wide"
            >
                {newSeedPhrase}
            </div>
            <button
                onclick={closeModal}
                class="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg"
            >
                I've Saved It
            </button>
        </div>
    </div>
{/if}
