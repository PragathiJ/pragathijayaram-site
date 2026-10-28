export interface Offer {
	title: string;
	description: string;
}

// The three engagement shapes, in the order they appear on /services.
export const SHAPES: Offer[] = [
	{
		title: 'Concept to launch',
		description:
			'You have a brief, a design, a web prototype or a validated idea, and you need the native product built and shipped. I own the architecture, the backend, the app, payments and subscriptions, analytics, the privacy requirements, and both store submissions. You get a codebase and accounts that belong to you, weekly written updates, and a product that passes review the first time because it was built for review from the start. Milestone based.',
	},
	{
		title: 'Finish and launch',
		description:
			'You have an app that exists: generated with an AI tool, built by a previous developer, or sitting in TestFlight with regressions. I stabilise it, close the gaps the stores reject, set up subscriptions so they survive upgrades, restores and both platforms, submit, and handle review until it is live. I start with a short paid review so you know what you are buying before any build hours start.',
	},
	{
		title: 'Launch readiness review',
		description:
			'A fixed-scope review of an app before it goes to Apple and Google. I check App Review and Play policy risk, subscription and in-app purchase setup, privacy labels and Data Safety answers against the real data flows, GDPR and EU consumer-law surfaces, build and signing configuration, and the SDK and target levels the stores currently enforce. You get a written report in priority order and a one-hour readout, within a week. For health, wellness and other sensitive-category apps this is where I am most useful.',
	},
];

// Secondary lanes, listed under "Also".
export const OFFERS: Offer[] = [
	{
		title: 'Production AI and LLM systems',
		description:
			'Features designed to perform beyond a demo: grounding, evaluation, structured outputs, cost and latency controls, failure handling, and the monitoring required after release.',
	},
	{
		title: 'Backend systems',
		description:
			'FastAPI and PostgreSQL designed for real operating conditions: API and data architecture, authentication, webhooks, idempotency, connection management and the failure modes that emerge under load.',
	},
];
