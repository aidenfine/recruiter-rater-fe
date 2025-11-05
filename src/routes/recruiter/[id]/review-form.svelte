<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Button } from '$lib/components/ui/button';
	import z from 'zod';

	let { recruiterId } = $props();

	const formSchema = z.object({
		rating: z.number().min(1, 'Please select a rating').max(5, 'cannot be larger than 5'),
		description: z.string()
	});

	let rating = $state(0);
	let description = $state('');
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let hoveredStar = $state(0);
	let reviewSubmitted = $state(false);

	const handleSubmit = async () => {
		errors = {};
		isSubmitting = true;

		const result = formSchema.safeParse({
			rating,
			description
		});
		if (!result.success) {
			result.error.errors.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = err.message;
				}
			});
			isSubmitting = false;
			return;
		}
		try {
			const payload = {
				recruiterId: recruiterId,
				rating: result.data?.rating,
				description: result.data?.description
			};

			const response = await fetch(`${env.PUBLIC_API_URL}api/v1/reviews`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Failed to add review' }));
				throw new Error(errorData.message || 'Failed to add recruiter');
			}

			reviewSubmitted = true;
		} catch (error) {
			console.error('Error submitting form:', error);
			errors.form = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};

	const setRating = (value: number) => {
		rating = value;
		errors.rating = '';
	};
</script>

<form onsubmit={handleSubmit} class="container mx-auto mt-20 max-w-md">
	{#if reviewSubmitted}
		Review has been submitted, to reduce spam your review is going through our review process.
	{:else}
		<div class="space-y-6">
			{#if errors.form}
				<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
					{errors.form}
				</div>
			{/if}

			<div class="space-y-2">
				<Label for="rating" class="text-base font-medium">Rating</Label>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4, 5] as star}
						<button
							type="button"
							aria-label="star-btn"
							onclick={() => setRating(star)}
							onmouseenter={() => (hoveredStar = star)}
							onmouseleave={() => (hoveredStar = 0)}
							disabled={isSubmitting}
							class="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<svg
								class="h-8 w-8 {hoveredStar >= star || rating >= star
									? 'fill-yellow-400 text-yellow-400'
									: 'fill-none text-gray-300'} transition-colors"
								stroke="currentColor"
								stroke-width="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
						</button>
					{/each}
				</div>
				{#if errors.rating}
					<p class="text-sm text-red-500">{errors.rating}</p>
				{/if}
			</div>
			<div class="space-y-2">
				<Label for="description" class="text-base font-medium">Description</Label>
				<Input
					name="description"
					type="text"
					bind:value={description}
					placeholder="Enter your review"
					class="w-full {errors.description ? 'border-red-500' : ''}"
					disabled={isSubmitting || reviewSubmitted}
				/>
			</div>
			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit'}
			</Button>
		</div>
	{/if}
</form>
