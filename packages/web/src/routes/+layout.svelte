<script lang="ts">
    import '../app.css'
    import favicon from '$lib/assets/favicon.svg'

    let { children } = $props()
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Yeon+Sung&display=swap"
        rel="stylesheet"
    />
    <title>Halil - Secure ToDo List For Developers</title>
</svelte:head>

{@render children()}

<style lang="postcss">
    @reference "tailwindcss";
</style>
