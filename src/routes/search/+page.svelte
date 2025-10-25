<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { extractLinkedinUsername } from '$lib/utils/extractLinkedinUsername';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import Star from '@lucide/svelte/icons/star';
	import { onDestroy } from 'svelte';

	interface Recruiter {
		id: string;
		createdAt: string;
		name: string;
		firstName: string;
		lastName: string;
		linkedinUsername: string;
		jobTitle: string | null;
		imageUrl: string | null;
		rating: number;
		currentCompany: string | null;
		verified: boolean;
	}

	let searchQuery = '';
	let searchStatus: 'idle' | 'found' | 'not_found' | 'error' = 'idle';
	let recruiters: Recruiter[] = [];

	let timeout: ReturnType<typeof setTimeout>;

	$: if (searchQuery) {
		clearTimeout(timeout);
		searchStatus = 'idle';
		timeout = setTimeout(() => {
			fetchRecruiter(searchQuery);
		}, 500);
	} else {
		recruiters = [];
		searchStatus = 'idle';
	}

	onDestroy(() => {
		clearTimeout(timeout);
	});

	async function fetchRecruiter(query: string) {
		try {
			const searchTerm = extractLinkedinUsername(query);
			const response = await fetch(
				`${PUBLIC_API_URL}api/v1/recruiter?search=${encodeURIComponent(searchTerm)}&url=true`
			);
			if (response.status === 200) {
				const data = await response.json();
				recruiters = data;
				searchStatus = 'found';
			} else if (response.status === 404) {
				recruiters = [];
				searchStatus = 'not_found';
			} else {
				recruiters = [];
				searchStatus = 'error';
			}
		} catch (error) {
			console.error('Fetch error:', error);
			recruiters = [];
			searchStatus = 'error';
		}
	}

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}

	async function goToRecruiterReviewPage(id: string) {
		await preloadData(`/recruiter/${id}`);
		await goto(`/recruiter/${id}`);
	}
</script>

<div class="mt-20 flex flex-col items-center justify-center gap-5 py-16">
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Search for a recruiter by name or LinkedIn url.
	</h4>

	<Input
		type="search"
		bind:value={searchQuery}
		placeholder="Search..."
		class="h-14 w-full max-w-3xl bg-white/70 px-6 text-lg shadow-lg backdrop-blur-md placeholder:text-gray-500"
	/>

	<!-- Results Container -->
	<div class="mt-4 w-full max-w-3xl">
		{#if searchStatus === 'found' && recruiters.length > 0}
			<div class="space-y-4">
				{#each recruiters as recruiter}
					<div
						on:click={() => goToRecruiterReviewPage(recruiter.id)}
						on:keydown={(e) => e.key === 'Enter' && goToRecruiterReviewPage(recruiter.id)}
						role="button"
						tabindex="0"
						class="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
					>
						<div class="flex items-start gap-4">
							<!-- Avatar -->
							<div class="shrink-0">
								{#if recruiter.imageUrl}
									<img
										src={recruiter.imageUrl}
										alt={recruiter.name}
										class="h-16 w-16 rounded-full object-cover"
									/>
								{:else}
									<div
										class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400 text-xl font-semibold text-white"
									>
										{getInitials(recruiter.firstName, recruiter.lastName)}
									</div>
								{/if}
							</div>

							<!-- Content -->
							<div class="grow">
								<div class="flex items-start justify-between">
									<div>
										<h3 class="flex items-center gap-2 text-lg font-semibold text-gray-900">
											{recruiter.name}
											{#if recruiter.verified}
												<BadgeCheck size={20} color="#2b7fff" />
											{/if}
										</h3>
										{#if recruiter.jobTitle}
											<p class="mt-1 text-sm text-gray-600">{recruiter.jobTitle}</p>
										{/if}
										{#if recruiter.currentCompany}
											<p class="mt-0.5 text-sm text-gray-500">{recruiter.currentCompany}</p>
										{/if}
									</div>

									<!-- Rating -->
									<div class="flex items-center gap-1">
										<Star color="#fcc800" fill="#fcc800" size={20} />
										<span class="text-sm font-medium text-gray-700">{recruiter.rating}</span>
									</div>
								</div>

								<!-- LinkedIn Link -->
								<div class="mt-4 flex items-center gap-2">
									<a
										href="https://linkedin.com/in/{recruiter.linkedinUsername}"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
									>
										<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
											/>
										</svg>
										View LinkedIn Profile
									</a>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if searchStatus === 'not_found'}
			<div class="py-8 text-center">
				<p class="mb-4 text-gray-600">No recruiters found matching your search.</p>
				<a href="/add-recruiter">
					<Button class="cursor-pointer">Add Recruiter</Button>
				</a>
			</div>
		{:else if searchStatus === 'error'}
			<div class="py-8 text-center">
				<p class="text-red-500">Internal Server Error. Please try again later.</p>
			</div>
		{/if}
	</div>
</div>
