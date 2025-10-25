<script lang="ts">
	import { env } from '$env/dynamic/private';
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
