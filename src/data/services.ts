import type { IconName } from '../components/Icon.astro';

export interface Offer {
	title: string;
	description: string;
	icon?: IconName;
	tag?: string;
}

// The three engagement shapes, in the order they appear on /services.
export const SHAPES: Offer[] = [
	{
		title: 'Concept to launch',
		icon: 'layers',
		tag: 'Milestone based',
		description:
			'You have a brief, a design, a web prototype or a validated idea, and you need the native product built and shipped. I own the architecture, the backend, the app, payments and subscriptions, analytics, the privacy requirements, and both store submissions. You get a codebase and accounts that belong to you, weekly written updates, and a product that passes review the first time because it was built for review from the start.',
	},
	{
		title: 'Finish and launch',
		icon: 'upgrade',
		tag: 'Starts with a short paid review',
		description:
			'You have an app that exists: generated with an AI tool, built by a previous developer, or sitting in TestFlight with regressions. I stabilise it, close the gaps the stores reject, set up subscriptions so they survive upgrades, restores and both platforms, submit, and handle review until it is live. I start with a short paid review so you know what you are buying before any build hours start.',
	},
	{
		title: 'Launch readiness review',
		icon: 'phone-check',
		tag: 'Fixed scope, within two weeks',
		description:
			'A fixed-scope review of an app before it goes to Apple and Google. I check App Review and Play policy risk, subscription and in-app purchase setup, privacy labels and Data Safety answers against the real data flows, GDPR and EU consumer-law surfaces, build and signing configuration, and the SDK and target levels the stores currently enforce. For health, wellness and other sensitive-category apps this is where I am most useful.',
	},
];

export interface CallType {
	title: string;
	description: string;
	icon: IconName;
}

// The consultation card, shown above the packages.
export const CALL = {
	title: 'Start with a call',
	duration: '30 or 60 minutes',
	price: '$75 / $140',
	intro:
		'Sometimes you do not need a package, you need an hour with someone who has done it. Tell me which kind of call when you book.',
	closing: 'You get written notes within a day. If a package follows, the call is credited against it.',
	types: [
		{
			title: 'Store readiness',
			icon: 'phone-check',
			description: 'Where your app stands against App Review and Play policy, and what to fix first.',
		},
		{
			title: 'Rejection triage',
			icon: 'alert',
			description: 'We read the notice together and leave with the fix and the reply.',
		},
		{
			title: 'Stack and architecture',
			icon: 'layers',
			description:
				'Expo or bare, which backend, which subscription provider, what to build now and what to defer.',
		},
		{
			title: 'AI feature scoping',
			icon: 'nodes',
			description:
				'What an LLM feature or agent would cost to run, what it needs to be reliable, and whether it is worth it for your product.',
		},
	] satisfies CallType[],
};

export interface Package {
	id: string;
	category: string;
	icon: IconName;
	title: string;
	duration: string;
	price: string;
	summary: string;
	description: string;
}

// Fixed-scope packages. Same names, durations and prices as the Upwork Project Catalog listings.
export const PACKAGES: Package[] = [
	{
		id: 'launch-readiness-review',
		category: 'Review',
		icon: 'phone-check',
		title: 'Launch readiness review',
		duration: '5 to 10 working days',
		price: 'from $600',
		summary:
			'The surfaces Apple and Google check, in a report ordered by what blocks approval.',
		description:
			'A focused look at the surfaces Apple and Google actually look at: configuration and permissions, build and target levels, sign-in and account deletion, purchase flows, privacy declarations, listing assets. You get a report in priority order, each finding mapped to the guideline and the change. It is not a line-by-line code audit; if you would like one, ask and I will quote it.',
	},
	{
		id: 'rejection-fix',
		category: 'Fix',
		icon: 'alert',
		title: 'Rejection fix and resubmission',
		duration: '1 to 2 weeks',
		price: 'from $400',
		summary: 'Send the notice. You get the fix, the reply, and company until the build is approved.',
		description:
			'Send me the notice. I find the guideline behind it, make or specify the fix, write the reply to the reviewer, and stay with you until the build is approved. I have been on the receiving end of these notices with my own app, so I know how reviewers read a reply and what makes them close the ticket.',
	},
	{
		id: 'expo-sdk-upgrade',
		category: 'Upgrade',
		icon: 'upgrade',
		title: 'Expo SDK upgrade',
		duration: '1 to 3 weeks',
		price: 'from $800',
		summary: 'Current SDK, native modules fixed, release build verified on both platforms.',
		description:
			'The stores raise their toolchain and target requirements every year, and an Expo SDK that falls more than a version or two behind stops producing a build they accept. I upgrade the SDK and native modules, fix what breaks, and verify a release build on both platforms, not just the dev client, because that is where the surprises live.',
	},
	{
		id: 'google-play-launch',
		category: 'Launch',
		icon: 'play',
		title: 'Google Play launch for an existing iOS app',
		duration: '2 to 3 weeks',
		price: 'from $1,200',
		summary: 'From iOS-only to live on Play, with its account, testing and policy rules handled.',
		description:
			'Play has its own rules: organisation account verification, the closed-testing requirement for new accounts, Data Safety, edge-to-edge and target levels, and release-build traps the iOS build never showed you. I take the app from iOS-only to live on Play, and you keep every account and credential.',
	},
	{
		id: 'subscriptions',
		category: 'Build',
		icon: 'card',
		title: 'Subscriptions on both stores',
		duration: '2 to 4 weeks',
		price: 'from $900',
		summary: 'Entitlements that survive upgrades, restores, refunds and the second platform.',
		description:
			'RevenueCat, or StoreKit and Play Billing directly, set up so entitlements survive upgrades, restores, refunds and the second platform. Includes paywall wiring, offer codes, webhooks and the server-side sync that keeps a cancelled user from staying Pro. This is the part most apps get wrong the first time, mine included, which is why I am careful with it now.',
	},
	{
		id: 'ai-features-and-agents',
		category: 'AI',
		icon: 'nodes',
		title: 'AI features and agents',
		duration: '3 to 8 weeks',
		price: 'from $1,500',
		summary: 'A feature or agent with grounding, a fallback model, limits, and a cost per call you can see.',
		description:
			'An LLM feature or an agent that does a real job inside your product: structured outputs, grounding, a fallback model, per-user limits, cost per call you can see, and EU-region hosting where the data asks for it. Anovi’s meal logging runs this way in production, and alongside it I am building an evidence-grounded nutrition research agent, which keeps me honest about what makes agents reliable rather than merely impressive.',
	},
	{
		id: 'security-review',
		category: 'Security',
		icon: 'shield',
		title: 'Security review for app and backend',
		duration: '1 to 3 weeks',
		price: 'from $1,200',
		summary: 'Tokens, authorisation, database grants, webhooks and secrets, with a fix for each finding.',
		description:
			'A code and configuration review, not a penetration test: token handling and secure storage, API authorisation, database grants and row-level security, webhook signature checks, secrets in builds and logs, dependency versions. You get findings in priority order with the fix for each. I wrote my incident checklist after my own hosting provider was breached, and I would rather you had it before anything happens.',
	},
];

export interface Step {
	title: string;
	description: string;
}

export const STEPS: Step[] = [
	{
		title: 'Email me',
		description: 'A short description of the product, where it stands and the outcome you need.',
	},
	{
		title: 'We scope it',
		description:
			'I reply within two working days with questions or a scoped proposal. Larger apps get a short paid scope call first, so neither of us is guessing.',
	},
	{
		title: 'Fixed quote, then start',
		description:
			'Packages are fixed price with a written result. Builds are milestone based. Nothing starts before the scope is agreed in writing.',
	},
];

export interface Faq {
	question: string;
	answer: string;
}

export const FAQ: Faq[] = [
	{
		question: 'What do you need from me to start?',
		answer:
			'Read access to the repo or a current build, and viewer access to App Store Connect and Google Play Console when the listings are in scope. Packages that change code need write access to a branch.',
	},
	{
		question: 'Can you guarantee approval?',
		answer:
			'No one can, and anyone who says so is guessing. What you get is every known blocker named and fixed before submission, and a specific answer to any notice that still comes back.',
	},
	{
		question: 'How do we work together?',
		answer:
			'Remote from Germany, in English, under a written agreement with IP assigned to you. Weekly written updates on anything longer than a week.',
	},
	{
		question: 'Do you take Flutter or native apps?',
		answer:
			'The packages are for Expo and React Native apps. The review and the consultations work for any mobile app, because the store rules are the same.',
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
