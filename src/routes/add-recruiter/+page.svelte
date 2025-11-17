<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { z } from 'zod';
	import { env } from '$env/dynamic/public';
	import { extractLinkedinUsername } from '$lib/utils/extractLinkedinUsername';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import Check from '@lucide/svelte/icons/check';

	const formSchema = z.object({
		firstName: z.string().min(1, 'First name is required').min(2, 'Required Field').max(50),
		lastName: z.string().min(1, 'Last name is required').min(2, 'Required Field').max(50),
		jobTitle: z.string().max(25, 'Must be 25 characters or less').optional(),
		linkedin: z.string().min(1, 'Link is too long.').max(200),
		currentCompany: z.string().max(50, 'Must be 50 characters or less').optional()
	});

	let promptRecruiterReviewSuccess = $state(false);

	let firstName = $state('');
	let lastName = $state('');
	let jobTitle = $state('');
	let linkedin = $state('');
	let currentCompany = $state('');

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

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
			promptRecruiterReviewSuccess = true;

			firstName = '';
			lastName = '';
			jobTitle = '';
			linkedin = '';
			currentCompany = '';
		} catch (error) {
			console.error('Error submitting form:', error);
			errors.form = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<form onsubmit={handleSubmit} class="container mx-auto mt-20 max-w-md">
	<div class="space-y-6">
		{#if errors.form}
			<div class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
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
				<p class="text-sm text-red-500">{errors.linkedin}</p>
			{:else}
				<p class="text-sm text-muted-foreground">LinkedIn URL or username</p>
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
				<p class="text-sm text-red-500">{errors.firstName}</p>
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
				<p class="text-sm text-red-500">{errors.lastName}</p>
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
				<p class="text-sm text-red-500">{errors.jobTitle}</p>
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
				<p class="text-sm text-red-500">{errors.currentCompany}</p>
			{/if}
		</div>

		{#if promptRecruiterReviewSuccess}
			<div>
				<Alert class="border-green-400">
					<Check color="#00c951" />
					<AlertTitle class="text-green-500">Success</AlertTitle>
					<AlertDescription>After review recruiter will be visible to review</AlertDescription>
				</Alert>
			</div>
		{/if}
		<Button
			type="submit"
			class="w-full"
			disabled={isSubmitting}
			aria-disabled={promptRecruiterReviewSuccess}
		>
			{isSubmitting ? 'Submitting...' : 'Submit'}
		</Button>
	</div>
</form>
