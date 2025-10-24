<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Provider } from '$lib/components/ui/tooltip';
	import { Tooltip } from 'bits-ui';
	import type { PageData } from './types';

	let { data }: { data: PageData } = $props();

	let recruiter = data.recruiter;
	let reviews = data.reviews;

	console.log(reviews, 'reviews');

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}

	function renderStars(rating: number) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

<div class="flex justify-center items-center py-16 px-4">
	<div class="w-full max-w-4xl flex flex-col gap-8">
		<!-- Recruiter Info Card -->
		<div class="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
			<div class="flex items-start gap-6">
				<!-- Avatar -->
				<div class="shrink-0">
					{#if recruiter.imageUrl}
						<img
							src={recruiter.imageUrl}
							alt={recruiter.name}
							class="w-24 h-24 rounded-full object-cover"
						/>
					{:else}
						<div
							class="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-3xl"
						>
							{getInitials(recruiter.firstName, recruiter.lastName)}
						</div>
					{/if}
				</div>

				<!-- Info -->
				<div class="grow">
					<div class="flex items-start justify-between">
						<div>
							<h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
								{recruiter.name}
							</h1>
							<p class="text-lg text-gray-600 mt-1">{recruiter.jobTitle}</p>
							<p class="text-md text-gray-500 mt-0.5">{recruiter.currentCompany}</p>
						</div>
					</div>

					<!-- Rating -->
					<div class="flex items-center gap-4 mt-4">
						<div class="flex items-center gap-2">
							<div class="flex">
								{#each renderStars(Math.floor(0)) as filled}
									<svg
										class="w-6 h-6 {filled ? 'text-yellow-400' : 'text-gray-300'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										/>
									</svg>
								{/each}
							</div>
							<span class="text-xl font-semibold text-gray-900">{recruiter.rating}</span>
						</div>
						<span class="text-gray-500">({reviews.length} reviews)</span>
					</div>

					<!-- LinkedIn -->
					<div class="mt-4">
						<a
							href="https://linkedin.com/in/{recruiter.linkedinUsername}"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
						>
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
							View LinkedIn Profile
						</a>
					</div>
				</div>
			</div>
			<div class="mt-4">
				<Button class="cursor-pointer">Leave a review</Button>
			</div>
		</div>

		<!-- Reviews Section -->
		<div>
			<h2 class="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

			<div class="space-y-4">
				{#if reviews.length == 0}
					<p class="leading-7 not-first:mt-6">
						Be the first to review {recruiter.name}!
					</p>
				{:else}
					{#each reviews as review}
						<div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
							<!-- Review Header -->
							<div class="flex items-start justify-between mb-4">
								<div>
									<p class="text-xs text-gray-500 mt-1">
										{new Date(review.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</p>
								</div>

								<!-- Rating Stars -->
								<div class="flex items-center gap-1">
									{#each renderStars(review.rating) as filled}
										<svg
											class="w-5 h-5 {filled ? 'text-yellow-400' : 'text-gray-300'}"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
									{/each}
								</div>
							</div>

							<!-- Review Comment -->
							<p class="text-gray-700 leading-relaxed">{review.description}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
