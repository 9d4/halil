<script>
    import api from '$lib/api'

    import Hero from '$lib/components/hero.svelte'

    let login = ''
    let error = ''

    async function handleLogin() {
        try {
            const res = await api.auth.login.$post({ json: { login } })
            const json = await res.json()

            if (res.ok) {
                alert('Login successful! Implement further steps as needed.')
                window.location.href = '/projects'
                return
            }

            if (!res.ok) {
                if (json?.message) {
                    error = json.message
                    return
                }

                error = 'Login failed'
                return
            }
        } catch (e) {
            error = 'Login failed. Reason: ' + e.message
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
</div>
