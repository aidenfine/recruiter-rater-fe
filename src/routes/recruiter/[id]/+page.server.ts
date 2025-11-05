import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {

	try {
		const recruiterResponse = await fetch(`${PUBLIC_API_URL}api/v1/recruiter/${params.id}`);


		if (!recruiterResponse.ok) {
			throw error(recruiterResponse.status, 'Recruiter not found');
		}

		const recruiter = await recruiterResponse.json();

		const reviewsResponse = await fetch(
			`${PUBLIC_API_URL}api/v1/reviews?recruiterId=${params.id}&limit=10`
		);


		let reviews = [];
		if (reviewsResponse.ok) {
			reviews = await reviewsResponse.json();
		} else {
			console.warn('Reviews fetch failed, returning empty array');
		}

		return {
			recruiter,
			reviews
		};
	} catch (err) {
		console.error('Error in load function:', err);
		if (err instanceof Error) {
			console.error('Error message:', err.message);
			console.error('Error stack:', err.stack);
		}
		throw error(
			500,
			`Failed to load recruiter data: ${err instanceof Error ? err.message : 'Unknown error'}`
		);
	}
};
