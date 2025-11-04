<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Button } from '$lib/components/ui/button';
	import z from 'zod';

	let { recruiterId } = $props();

	const formSchema = z.object({
		rating: z.number().max(5, 'cannot be larger than 5'),
		description: z.string()
	});

	let rating = 5;
	let description = '';
	let errors: Record<string, string> = {};
	let isSubmitting = false;

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
				console.log('review validation failed', errors);
				isSubmitting = false;
				return;
			});
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
					'Content-Tyoe': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Failed to add review' }));
				throw new Error(errorData.message || 'Failed to add recruiter');
			}

			const data = await response.json();
			console.log('data', data);
		} catch (error) {
			console.error('Error submitting form:', error);
			errors.form = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<!-- svelte-ignore event_directive_deprecated -->
<form on:submit|preventDefault={handleSubmit} class="container mx-auto mt-20 max-w-md">
	<div class="space-y-6">
		{#if errors.form}
			<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
				{errors.form}
			</div>
		{/if}

		<div class="space-y-2">
			<Label for="rating" class="text-base font-medium">Rating</Label>
			<Input
				name="rating"
				type="number"
				bind:value={rating}
				placeholder="0"
				class="w-full {errors.rating ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
		</div>
		<div class="space-y-2">
			<Label for="description" class="text-base font-medium">Description</Label>
			<Input
				name="description"
				type="text"
				bind:value={description}
				placeholder="0"
				class="w-full {errors.description ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
		</div>
		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{isSubmitting ? 'Submitting...' : 'Submit'}
		</Button>
	</div>
</form>
