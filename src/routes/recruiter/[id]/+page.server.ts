import { PUBLIC_API_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, fetch }) => {
    console.log("making api request")

    try {
        console.log("recruiter url", `${PUBLIC_API_URL}api/v1/recruiter/${params.id}`)
        const recruiterResponse = await fetch(`${PUBLIC_API_URL}api/v1/recruiter/${params.id}`);

        console.log('Recruiter response status:', recruiterResponse.status);

        if (!recruiterResponse.ok) {
            throw error(recruiterResponse.status, 'Recruiter not found');
        }

        const recruiter = await recruiterResponse.json();
        console.log('Recruiter data:', recruiter);

        console.log("review url", `${PUBLIC_API_URL}api/v1/reviews?recruiterId=${params.id}&limit=10`)
        const reviewsResponse = await fetch(`${PUBLIC_API_URL}api/v1/reviews?recruiterId=${params.id}&limit=10`);

        console.log('Reviews response status:', reviewsResponse.status);

        let reviews = [];
        if (reviewsResponse.ok) {
            reviews = await reviewsResponse.json();
            console.log('Reviews data:', reviews);
        } else {
            console.warn('Reviews fetch failed, returning empty array');
        }

        return {
            recruiter,
            reviews,
        };
    } catch (err) {
        console.error('Error in load function:', err);
        if (err instanceof Error) {
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
        }
        throw error(500, `Failed to load recruiter data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
}