export function extractLinkedinUsername(input: string): string {
	// Remove whitespace
	input = input.trim();

	// Pattern matches:
	// - linkedin.com/in/username
	// - www.linkedin.com/in/username
	// - https://linkedin.com/in/username
	// - https://www.linkedin.com/in/username/
	const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/i;
	const match = input.match(linkedinRegex);

	if (match && match[1]) {
		return match[1];
	}

	// If no match, assume it's already a username
	return input;
}
