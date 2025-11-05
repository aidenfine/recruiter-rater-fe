export type Recruiter = {
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
};

export type Review = {
	id: string;
	recruiterId: string;
	createdAt: string;
	rating: number;
	description: string;
	thumbsDownCount: number;
	thumbsUpCount: number;
	recruiterName?: string;
};

export type PageData = {
	recruiter: Recruiter;
	reviews: Review[];
};
