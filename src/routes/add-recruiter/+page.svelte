<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { z } from 'zod';
	import { env } from '$env/dynamic/public';
	import { extractLinkedinUsername } from '$lib/utils/extractLinkedinUsername';

	const formSchema = z.object({
		firstName: z.string().min(1, 'First name is required').min(2, 'Required Field').max(50),
		lastName: z.string().min(1, 'Last name is required').min(2, 'Required Field').max(50),
		jobTitle: z.string().max(25, 'Must be 25 characters or less').optional(),
		linkedin: z.string().min(1, 'LinkedIn is required').max(50),
		currentCompany: z.string().max(50, 'Must be 50 characters or less').optional()
	});

	let firstName = '';
	let lastName = '';
	let jobTitle = '';
	let linkedin = '';
	let currentCompany = '';

	let errors: Record<string, string> = {};
	let isSubmitting = false;

	const handleSubmit = async () => {
		errors = {};
		isSubmitting = true;

		const result = formSchema.safeParse({
			firstName,
			lastName,
			jobTitle,
			linkedin,
			currentCompany
		});

		if (!result.success) {
			result.error.errors.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = err.message;
				}
			});
			console.log('Form validation failed:', errors);
			isSubmitting = false;
			return;
		}

		try {
			const linkedinUsername = extractLinkedinUsername(linkedin);

			const payload = {
				name: result.data.firstName + ' ' + result.data.lastName,
				firstName: result.data.firstName,
				lastName: result.data.lastName,
				linkedin: linkedinUsername,
				jobTitle: result.data.jobTitle || null,
				currentCompany: result.data.currentCompany || null
			};

			const response = await fetch(`${env.PUBLIC_API_URL}api/v1/add-recruiter`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: 'Failed to add recruiter' }));
				throw new Error(errorData.message || 'Failed to add recruiter');
			}

			const data = await response.json();
			console.log('Success:', data);

			firstName = '';
			lastName = '';
			jobTitle = '';
			linkedin = '';
			currentCompany = '';

			alert('Recruiter added successfully!'); //TODO: change later to snackbar or something
		} catch (error) {
			console.error('Error submitting form:', error);
			errors.form = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="container mx-auto mt-20 max-w-md">
	<div class="space-y-6">
		{#if errors.form}
			<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
				{errors.form}
			</div>
		{/if}

		<div class="space-y-2">
			<Label for="linkedin" class="text-base font-medium">LinkedIn*</Label>
			<Input
				name="linkedin"
				type="text"
				bind:value={linkedin}
				placeholder="https://linkedin.com/in/username"
				class="w-full {errors.linkedin ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
			{#if errors.linkedin}
				<p class="text-red-500 text-sm">{errors.linkedin}</p>
			{:else}
				<p class="text-muted-foreground text-sm">LinkedIn URL or username</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="firstName" class="text-base font-medium">First Name*</Label>
			<Input
				name="firstName"
				type="text"
				bind:value={firstName}
				placeholder="John"
				class="w-full {errors.firstName ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
			{#if errors.firstName}
				<p class="text-red-500 text-sm">{errors.firstName}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="lastName" class="text-base font-medium">Last Name*</Label>
			<Input
				name="lastName"
				type="text"
				bind:value={lastName}
				placeholder="Doe"
				class="w-full {errors.lastName ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
			{#if errors.lastName}
				<p class="text-red-500 text-sm">{errors.lastName}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="jobTitle" class="text-base font-medium">Job Title</Label>
			<Input
				name="jobTitle"
				type="text"
				bind:value={jobTitle}
				placeholder="Recruiter"
				class="w-full {errors.jobTitle ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
			{#if errors.jobTitle}
				<p class="text-red-500 text-sm">{errors.jobTitle}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<Label for="currentCompany" class="text-base font-medium">Current Company</Label>
			<Input
				name="currentCompany"
				type="text"
				bind:value={currentCompany}
				placeholder="Meta"
				class="w-full {errors.currentCompany ? 'border-red-500' : ''}"
				disabled={isSubmitting}
			/>
			{#if errors.currentCompany}
				<p class="text-red-500 text-sm">{errors.currentCompany}</p>
			{/if}
		</div>

		<Button type="submit" class="w-full" disabled={isSubmitting}>
			{isSubmitting ? 'Submitting...' : 'Submit'}
		</Button>
	</div>
</form>
