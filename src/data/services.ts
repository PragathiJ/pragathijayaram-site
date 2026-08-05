export interface Offer {
	title: string;
	description: string;
}

export const OFFERS: Offer[] = [
	{
		title: 'Mobile products, end to end',
		description:
			'React Native and Expo products from technical architecture and the first screen through testing, release builds and App Store submission. I can own the complete mobile workstream or step into an existing product to resolve architecture, reliability, performance or release problems.',
	},
	{
		title: 'Production AI and LLM systems',
		description:
			'AI and LLM features designed to perform reliably beyond a demo. This includes system architecture, grounding, evaluation, structured outputs, prompt and model versioning, cost and latency controls, failure handling, and the monitoring required after release.',
	},
	{
		title: 'Backend systems and architecture',
		description:
			'FastAPI and PostgreSQL systems designed around reliability, maintainability and real operating conditions. My work includes API and data architecture, authentication, background processing, webhooks, idempotency, connection management and the failure modes that emerge under production load.',
	},
	{
		title: 'Zero-to-one product engineering',
		description:
			'Turning an early idea into a product that can be used, evaluated and released. I work across product scoping, technical architecture, mobile and backend implementation, analytics, subscriptions, privacy requirements and the platform constraints that determine whether a product can launch.',
	},
	{
		title: 'Technical investigation and writing',
		description:
			'Reproducible technical investigations, engineering case studies and documentation grounded in implementation evidence. I document the architecture decisions, failed approaches, measurements and debugging work behind the final conclusion.',
	},
];
