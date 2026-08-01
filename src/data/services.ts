export interface Offer {
	title: string;
	description: string;
}

export const OFFERS: Offer[] = [
	{
		title: 'Mobile apps, end to end',
		description:
			'React Native and Expo, from the first screen to a released build, including the store work most projects underestimate.',
	},
	{
		title: 'AI features that survive contact with users',
		description:
			'LLM features with grounding, evaluation, cost control and versioned prompts, so the output holds up when it reaches real people.',
	},
	{
		title: 'Backend engineering',
		description:
			'FastAPI and PostgreSQL, API and webhook reliability, idempotency, connection pooling and the failure modes that only appear under load.',
	},
	{
		title: 'Product development, zero to one',
		description:
			'Taking an idea to a shipped product, including the privacy, consumer law and store requirements that decide whether it can launch at all.',
	},
	{
		title: 'Technical writing',
		description:
			'Deep-dive engineering articles with receipts, written from the actual work rather than from a brief.',
	},
];
