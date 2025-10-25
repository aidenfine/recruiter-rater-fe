import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const recentReviewsRequest = await fetch(`${PUBLIC_API_URL}api/v1/reviews/recent?limit=6`);

		if (!recentReviewsRequest.ok) {
			throw error(recentReviewsRequest.status, 'Failed to fetch reviews');
		}

		const recentReviews = await recentReviewsRequest.json();

		return {
			reviews: recentReviews
		};
	} catch (err) {
		console.error('Error fetching reviews:', err);
		throw error(500, 'Failed to load reviews');
	}
};
