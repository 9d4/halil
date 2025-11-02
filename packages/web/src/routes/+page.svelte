<script lang="ts">
    import { hc, type InferResponseType } from 'hono/client'
    import type { APIType } from 'halil/server/router/api.ts'
    import { onMount } from 'svelte'
    import Hero from '$lib/components/hero.svelte'

    const api = hc<APIType>('/api')
    let isLoading = true
    let error: null | string = null
    let users = $state([]) as InferResponseType<typeof api.users.$get>

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

        // setInterval(() => {
        //     users.push({
        //         login: 'new_user_' + Math.floor(Math.random() * 1000),
        //     })
        //     console.log('pushed')
        // }, 1000)
    })
</script>

<div
    class="min-h-screen flex flex-col justify-center items-center font-yeon-sung"
>
    <div class="text-center font-display space-y-6 px-4 max-w-2xl">
        <Hero />
        <p class="text-lg md:text-xl leading-relaxed opacity-80">
            Simple yet secure ToDo List for developers. Organize your tasks
            effortlessly with end-to-end encryption and a developer friendly
            cli.
        </p>
        <div class="mt-8 flex gap-4 justify-center">
            <a
                href="/login"
                class="bg-white text-gray-700 font-medium py-3 px-8 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition duration-300"
            >
                Get Started
            </a>
            <a
                href="/login"
                class="bg-gray-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm border border-gray-600 hover:bg-gray-800 hover:shadow-md transition duration-300"
            >
                Login
            </a>
        </div>
    </div>
</div>

<style>
</style>
