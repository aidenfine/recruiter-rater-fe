<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LandingPageData } from './types';
	import Star from '@lucide/svelte/icons/star';

	let { data }: { data: LandingPageData } = $props();
</script>

<div class="container mx-auto mt-20 flex flex-col items-center gap-5">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Don't waste your time with bad recruiters.
	</h1>
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Check out what other people say first.
	</h4>

	<a href="/search">
		<Button class="cursor-pointer">Find or Review a recruiter</Button>
	</a>
</div>
<!-- recent review section -->
<section class="container mx-auto mt-20 px-4 py-16">
	<!-- divider -->
	<hr class="container mx-auto my-12 border-gray-200" />

	<h2 class="mb-8 text-3xl font-bold">Recent Reviews</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.reviews as review}
			<div class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
				<div class="mb-4 flex items-start justify-between">
					<div>
						<p class="text-sm text-gray-600">{review.recruiterName ?? ''}</p>
					</div>
					<div class="flex items-center gap-1">
						{#each Array(5) as _, i}
							<Star
								size={16}
								fill={i < review.rating ? '#fcc800' : '#d1d5dc'}
								color={i < review.rating ? '#fcc800' : '#d1d5dc'}
							/>
						{/each}
					</div>
				</div>

				<p class="mb-4 line-clamp-4 text-gray-700">
					{review.description}
				</p>

				<div class="mt-4 border-t border-gray-200 pt-4">
					<p class="text-xs text-gray-500">
						{new Date(review.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>
