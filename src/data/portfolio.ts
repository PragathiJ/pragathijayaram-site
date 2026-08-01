export interface Link {
	href: string;
	label: string;
}

export interface Project {
	name: string;
	meta: string;
	body: string[];
	links: Link[];
}

export const PROJECTS: Project[] = [
	{
		name: 'Anovi, a nutrition and meal planning app',
		meta: 'Sole developer · React Native · FastAPI · PostgreSQL · Germany',
		body: [
			'Anovi plans meals around what someone already has, what they like, and what their nutrition targets still need. It connects pantry stock, grocery lists, recipes and nutrient gaps into a single flow, with an LLM pipeline that turns free-text meal logs into structured ingredients, and a generator that ranks recipes against several competing objectives at once.',
			'The work covered the PostgreSQL schema and FastAPI backend, the React Native app, the subscription and paywall layer, German and English localisation, and the privacy, consumer law and App Store requirements that decide whether a product in this space can launch at all.',
		],
		links: [{ href: 'https://www.anoviwellness.com', label: 'Visit the site' }],
	},
	{
		name: 'Tracing a React Native iOS recycling bug',
		meta: 'Production debugging · React Native · iOS · Open source',
		body: [
			'A production UI failure caused newly opened screens to scroll into persistent blank space. I traced the behaviour into React Native’s Fabric implementation and found that keyboard-inset state could survive native ScrollView recycling.',
			'I reduced the failure to a dependency-free reproducer with automated detection, verified it across multiple React Native releases, documented the source-level mechanism and control cases, and filed the investigation upstream as React Native issue #57755.',
		],
		links: [
			{
				href: 'https://github.com/facebook/react-native/issues/57755',
				label: 'Read the investigation',
			},
			{ href: 'https://github.com/PragathiJ/rn-aaki-recycle-repro', label: 'Explore the reproducer' },
		],
	},
];

export const BUILDING: string[] = [
	'Evidence-Grounded Nutrition Research Copilot. Retrieval and citation design for nutrition evidence, built to refuse questions the sources cannot answer.',
	'Cycle-aware nutrition flow. Symptom and phase aware planning, scoped to stay non-medical.',
];
