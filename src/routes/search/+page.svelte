<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { extractLinkedinUsername } from '$lib/utils/extractLinkedinUsername';
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

<div class="flex justify-center items-center py-16 mt-20 flex-col gap-5">
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Search for a recruiter by name or LinkedIn url.
	</h4>

	<Input
		type="search"
		bind:value={searchQuery}
		placeholder="Search..."
		class="w-full max-w-3xl h-14 px-6 text-lg bg-white/70 backdrop-blur-md shadow-lg placeholder:text-gray-500"
	/>

	<!-- Results Container -->
	<div class="w-full max-w-3xl mt-4">
		{#if searchStatus === 'found' && recruiters.length > 0}
			<div class="space-y-4">
				{#each recruiters as recruiter}
					<div
						on:click={() => goToRecruiterReviewPage(recruiter.id)}
						on:keydown={(e) => e.key === 'Enter' && goToRecruiterReviewPage(recruiter.id)}
						role="button"
						tabindex="0"
						class="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
					>
						<div class="flex items-start gap-4">
							<!-- Avatar -->
							<div class="shrink-0">
								{#if recruiter.imageUrl}
									<img
										src={recruiter.imageUrl}
										alt={recruiter.name}
										class="w-16 h-16 rounded-full object-cover"
									/>
								{:else}
									<div
										class="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl"
									>
										{getInitials(recruiter.firstName, recruiter.lastName)}
									</div>
								{/if}
							</div>

							<!-- Content -->
							<div class="grow">
								<div class="flex items-start justify-between">
									<div>
										<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
											{recruiter.name}
											{#if recruiter.verified}
												<svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"
													/>
												</svg>
											{/if}
										</h3>
										{#if recruiter.jobTitle}
											<p class="text-sm text-gray-600 mt-1">{recruiter.jobTitle}</p>
										{/if}
										{#if recruiter.currentCompany}
											<p class="text-sm text-gray-500 mt-0.5">{recruiter.currentCompany}</p>
										{/if}
									</div>

									<!-- Rating -->
									<div class="flex items-center gap-1">
										<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
											<path
												d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
											/>
										</svg>
										<span class="text-sm font-medium text-gray-700">{recruiter.rating}</span>
									</div>
								</div>

								<!-- LinkedIn Link -->
								<div class="mt-4 flex items-center gap-2">
									<a
										href="https://linkedin.com/in/{recruiter.linkedinUsername}"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
									>
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
			<div class="text-center py-8">
				<p class="text-gray-600 mb-4">No recruiters found matching your search.</p>
				<a href="/add-recruiter">
					<Button class="cursor-pointer">Add Recruiter</Button>
				</a>
			</div>
		{:else if searchStatus === 'error'}
			<div class="text-center py-8">
				<p class="text-red-500">Internal Server Error. Please try again later.</p>
			</div>
		{/if}
	</div>
</div>
