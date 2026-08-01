export interface Offer {
	title: string;
	description: string;
}

export const OFFERS: Offer[] = [
	{
		title: 'Mobile apps, end to end',
		description:
			'React Native and Expo development from product architecture and the first screen through testing, release builds, and App Store submission, including the store work and edge cases that projects often underestimate.',
	},
	{
		title: 'AI features that hold up in production',
		description:
			'AI and LLM features designed for real users, with grounding, evaluation, structured outputs, cost and latency controls, prompt versioning, failure handling, and the monitoring needed after release.',
	},
	{
		title: 'Backend engineering',
		description:
			'FastAPI and PostgreSQL systems, including API design, data modelling, authentication, background jobs, webhook reliability, idempotency, connection management, and the failure modes that only appear under real load.',
	},
	{
		title: 'Product development, zero to one',
		description:
			'Turning an early idea into a usable, released product. This can include product scoping, technical architecture, frontend and backend implementation, analytics, subscriptions, privacy requirements, and the platform rules that determine whether a product can launch.',
	},
	{
		title: 'Technical writing',
		description:
			'In-depth engineering articles, case studies, and technical documentation grounded in actual implementation work, including the architecture decisions, failed approaches, debugging process, and evidence behind the final result.',
	},
];
