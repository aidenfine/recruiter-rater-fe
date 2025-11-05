<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
</script>

<ModeWatcher />

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-md">
		<div class="container mx-auto flex items-center justify-between px-4 py-3">
			<a href="/" class="text-xl font-bold">Rate My Recruiters</a>
			<Button onclick={toggleMode} variant="outline" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</header>

	<main class="flex-1">
		<slot />
	</main>

	<footer></footer>
</div>
