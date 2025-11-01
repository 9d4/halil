<script lang="ts">
    import { hc, type InferResponseType } from 'hono/client'
    import type { APIType } from 'halil/server/router/api.ts'
    import { onMount } from 'svelte'

    const api = hc<APIType>('/api')
    let isLoading = true
    let error: null | string = null
    let users = [] as InferResponseType<typeof api.users.$get>

    onMount(async () => {
        const res = await api.users
            .$get()
            .then((r) => r.json())
            .catch((e) => {
                console.error(e)
                error = 'Failed to fetch users'
            })
        users = Array.isArray(res) ? res : []
        isLoading = false
    })
</script>

<h1>List users in app</h1>

{#if isLoading}
    <p>Loading users...</p>
{:else if error}
    <p style="color: red">{error}</p>
{:else}
    <ul>
        {#each users as user}
            <li>
                {user.login}
                {#if user.name}
                    &middot;{user.name}
                {/if}
            </li>
            <!-- <li>{user.login} &middot; {user.name}</li> -->
            <!-- <li>{user.login} &middot; {user.name}</li> -->
            <!-- <li>{user.login} &middot; {user.name}</li> -->
        {/each}
    </ul>
{/if}
