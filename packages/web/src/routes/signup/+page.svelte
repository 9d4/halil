<script lang="ts">
    import api from '$lib/api'
    import Hero from '$lib/components/hero.svelte'

    let login = ''
    let password = ''
    let name = ''
    let error = ''
    let ok = false

    async function handleSignup() {
        error = ''
        try {
            const res = await api.auth.signup.$post({
                json: { login, password, name: name || undefined },
            })
            const json: Record<string, unknown> = await res.json()

            if (res.ok) {
                ok = true
                return
            }

            error = (json.message as string) || 'Signup failed'
        } catch {
            error = 'Signup failed'
        }
    }
</script>

<div
    class="font-display min-h-screen flex flex-col justify-center items-center"
>
    <Hero />

    {#if ok}
        <p class="mt-8 text-green-600">Account created!</p>
        <a href="/login" class="mt-2 text-gray-600 underline">Log in</a>
    {:else}
        <form
            on:submit|preventDefault={handleSignup}
            class="mt-6 w-full max-w-sm flex flex-col gap-3"
        >
            <input
                bind:value={login}
                placeholder="Username"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
            />
            <input
                type="password"
                bind:value={password}
                placeholder="Password (min 6 chars)"
                required
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
            />
            <input
                bind:value={name}
                placeholder="Display name (optional)"
                class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
            />
            <button
                type="submit"
                class="w-full py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition duration-300"
            >
                Sign Up
            </button>
            {#if error}<p class="text-red-500 text-center text-sm">
                    {error}
                </p>{/if}
        </form>
        <p class="mt-4 text-sm text-gray-500">
            Already have an account? <a href="/login" class="underline"
                >Log in</a
            >
        </p>
    {/if}
</div>
