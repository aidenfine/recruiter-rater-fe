<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
</script>

<div class="min-h-screen flex flex-col">
	<header class="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
		<div class="container mx-auto flex items-center justify-between px-4 py-3">
			<a href="/" class="text-xl font-bold">APP_NAME</a>
			<a href="/search">
				<Button>Search</Button>
			</a>
		</div>
	</header>

	<main class="flex-1">
		<slot />
	</main>

	<footer></footer>
</div>
