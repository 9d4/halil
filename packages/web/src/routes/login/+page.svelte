<script lang="ts">
    import api from '$lib/api'

    import Hero from '$lib/components/hero.svelte'

    let login = ''
    let password = ''
    let error = ''

    async function handleLogin() {
        try {
            const res = await api.auth.login.$post({
                json: { login, password },
            })
            const json: Record<string, unknown> = await res.json()

            if (res.ok) {
                window.location.href = '/projects'
                return
            }

            error = (json.message as string) || 'Login failed'
        } catch (e) {
            error = 'Login failed'
        }
    }
</script>

<div
    class="font-display min-h-screen flex flex-col justify-center items-center"
>
    <Hero />
    <form
        on:submit|preventDefault={handleLogin}
        class="mt-6 w-full max-w-sm flex flex-col gap-3"
    >
        <input
            bind:value={login}
            placeholder="Username"
            required
            class="w-full p-3 border border-gray-300 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
        />

        <input
            type="password"
            bind:value={password}
            placeholder="Password"
            required
            class="w-full p-3 border border-gray-300 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
        />

        <button
            type="submit"
            class="w-full py-3 rounded-xl bg-gray-900 text-white font-medium
               hover:bg-gray-800 transition duration-300"
        >
            Login
        </button>

        {#if error}
            <p class="text-red-500 text-center text-sm">{error}</p>
        {/if}
    </form>
    <p class="mt-4 text-sm text-gray-500">
        Don't have an account? <a href="/signup" class="underline">Sign up</a>
    </p>
</div>
