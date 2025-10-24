<script>
	import Button from '$lib/components/ui/button/button.svelte';
	const reviews = [
		{
			id: 1,
			recruiterName: 'Sarah Johnson',
			company: 'TechRecruit Pro',
			rating: 5,
			reviewText:
				'Sarah was absolutely amazing! She took the time to understand my career goals and found me the perfect role. Responsive, professional, and genuinely cared about my success.',
			author: 'Mike Chen',
			role: 'Software Engineer',
			date: '2 days ago'
		},
		{
			id: 2,
			recruiterName: 'David Martinez',
			company: 'Elite Talent Solutions',
			rating: 2,
			reviewText:
				'Promised a lot but delivered very little. Ghosted me after the first interview and never returned my calls. Would not recommend working with this recruiter.',
			author: 'Jessica Park',
			role: 'Product Manager',
			date: '1 week ago'
		},
		{
			id: 3,
			recruiterName: 'Emily Roberts',
			company: 'StartUp Staffing',
			rating: 4,
			reviewText:
				'Good experience overall. Emily was knowledgeable about the industry and helped negotiate a better salary. Only downside was communication could be faster.',
			author: 'Alex Thompson',
			role: 'UX Designer',
			date: '3 weeks ago'
		},
		{
			id: 4,
			recruiterName: 'James Wilson',
			company: 'Corporate Recruiters Inc',
			rating: 1,
			reviewText:
				"Waste of time. Submitted my resume to roles I specifically said I wasn't interested in. Felt like just another number to them.",
			author: 'Rachel Kim',
			role: 'Data Analyst',
			date: '1 month ago'
		},
		{
			id: 5,
			recruiterName: 'Maria Garcia',
			company: 'Precision Placement',
			rating: 5,
			reviewText:
				"Maria went above and beyond! She prepared me for interviews, provided honest feedback, and checked in even after I got the job. Best recruiter I've ever worked with.",
			author: 'Tom Bradley',
			role: 'DevOps Engineer',
			date: '1 month ago'
		},
		{
			id: 6,
			recruiterName: 'Chris Anderson',
			company: 'Quick Hire Agency',
			rating: 3,
			reviewText:
				"Average experience. Chris got me interviews but didn't provide much guidance. Eventually found a job through them but had to do most of the legwork myself.",
			author: 'Lauren Smith',
			role: 'Marketing Manager',
			date: '2 months ago'
		}
	];
</script>

<div class="container mx-auto flex-col flex items-center mt-20 gap-5">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Don't waste your time with shit recruiters.
	</h1>
	<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
		Let's find someone that will actually support you.
	</h4>

	<a href="/search">
		<Button class="cursor-pointer">Find or Review a recruiter</Button>
	</a>
</div>
<!-- recent review section -->
<section class="container mx-auto px-4 py-16 mt-20">
	<!-- divider -->
	<hr class="container mx-auto my-12 border-gray-200" />

	<h2 class="text-3xl font-bold mb-8">Recent Reviews</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each reviews as review}
			<div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
				<div class="flex items-start justify-between mb-4">
					<div>
						<h3 class="font-bold text-lg">{review.recruiterName}</h3>
						<p class="text-sm text-gray-600">{review.company}</p>
					</div>
					<div class="flex items-center gap-1">
						{#each Array(5) as _, i}
							*
						{/each}
					</div>
				</div>

				<p class="text-gray-700 mb-4 line-clamp-4">
					{review.reviewText}
				</p>

				<div class="border-t border-gray-200 pt-4 mt-4">
					<p class="text-sm font-semibold">{review.author}</p>
					<p class="text-xs text-gray-500">{review.role} • {review.date}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
