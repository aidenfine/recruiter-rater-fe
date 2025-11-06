<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="text-center">
		<h1 class="text-9xl font-bold text-gray-800">
			{$page.status}
		</h1>

		<h2 class="mt-4 text-3xl font-semibold text-gray-700">
			{#if $page.status === 404}
				Page Not Found
			{:else}
				Something Went Wrong
			{/if}
		</h2>

		<p class="mt-4 text-lg text-gray-600">
			{#if $page.status === 404}
				You seem lost. This page doesnt exist
				<br />
				[THIS IS NOT AN EXIT]
			{:else}
				{$page.error?.message || 'An unexpected error occurred'}
			{/if}
		</p>

		<div class="mt-2 flex justify-center gap-4">
			<Button onclick={() => (window.location.href = '/')}>Go Home</Button>
		</div>
	</div>
</div>
