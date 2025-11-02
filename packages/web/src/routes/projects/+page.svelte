<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()
</script>

<h1 class="font-display text-4xl font-bold mb-4">Projects</h1>
<p class="font-serif">Place where we can organize our projects.</p>

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
