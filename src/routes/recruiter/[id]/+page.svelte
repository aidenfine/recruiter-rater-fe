<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageData } from './types';
	import Star from '@lucide/svelte/icons/star';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ReviewForm from './review-form.svelte';

	let { data }: { data: PageData } = $props();

	let showReviewForm = $state(false);
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

<div class="flex items-center justify-center px-4 py-16">
	<div class="flex w-full max-w-4xl flex-col gap-8">
		<!-- Recruiter Info Card -->
		<div class="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
			<div class="flex items-start gap-6">
				<!-- Avatar -->
				<div class="shrink-0">
					{#if recruiter.imageUrl}
						<img
							src={recruiter.imageUrl}
							alt={recruiter.name}
							class="h-24 w-24 rounded-full object-cover"
						/>
					{:else}
						<div
							class="flex h-24 w-24 items-center justify-center rounded-full bg-gray-400 text-3xl font-semibold text-white"
						>
							{getInitials(recruiter.firstName, recruiter.lastName)}
						</div>
					{/if}
				</div>

				<!-- Info -->
				<div class="grow">
					<div class="flex items-start justify-between">
						<div>
							<h1 class="flex items-center gap-3 text-3xl font-bold text-gray-900">
								{recruiter.name}
							</h1>
							<p class="mt-1 text-lg text-gray-600">{recruiter.jobTitle}</p>
							<p class="text-md mt-0.5 text-gray-500">{recruiter.currentCompany}</p>
						</div>
					</div>

					<!-- Rating -->
					<div class="mt-4 flex items-center gap-4">
						<div class="flex items-center gap-2">
							<div class="flex">
								{#each renderStars(Math.floor(0)) as filled}
									<Star
										fill={filled ? '#fcc800' : '#d1d5dc'}
										color={filled ? '#fcc800' : '#d1d5dc'}
									/>
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
							class="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
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
				<Button class="cursor-pointer" onclick={() => (showReviewForm = true)}
					>Leave a review</Button
				>
			</div>
		</div>
		{#if showReviewForm}
			<div>
				<h2 class="mb-6 text-2xl font-bold text-gray-900">Review: {recruiter.name}</h2>
			</div>
			<Separator />
			<ReviewForm recruiterId={recruiter.id} />
		{/if}

		<!-- Reviews Section -->
		<div>
			<h2 class="mb-6 text-2xl font-bold text-gray-900">Reviews</h2>

			<div class="space-y-4">
				{#if reviews.length == 0}
					<p class="leading-7 not-first:mt-6">
						Be the first to review {recruiter.name}!
					</p>
				{:else}
					{#each reviews as review}
						<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<!-- Review Header -->
							<div class="mb-4 flex items-start justify-between">
								<div>
									<p class="mt-1 text-xs text-gray-500">
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
										<Star
											size={16}
											fill={filled ? '#fcc800' : '#d1d5dc'}
											color={filled ? '#fcc800' : '#d1d5dc'}
										/>
									{/each}
								</div>
							</div>

							<!-- Review Comment -->
							<p class="leading-relaxed text-gray-700">{review.description}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
