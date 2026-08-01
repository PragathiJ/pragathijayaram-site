export interface Link {
	href: string;
	label: string;
}

export interface Project {
	name: string;
	role: string;
	description: string;
	links: Link[];
}

export const PROJECTS: Project[] = [
	{
		name: 'Anovi',
		role: 'Founder. Everything from schema to App Store.',
		description:
			'A nutrition and meal planning app for iOS, built and shipped solo. React Native and Expo on the front, FastAPI and PostgreSQL behind it. I designed the data model, the meal plan generator, the LLM pipeline for ingredient extraction, the subscription layer, the German and English localisation, and the privacy and consumer law work required to launch it in Germany.',
		links: [{ href: 'https://www.anoviwellness.com', label: 'anoviwellness.com' }],
	},
	{
		name: 'react-native#57755',
		role: 'Upstream issue and reproducer.',
		description:
			'A scroll view in React Native’s new architecture keeps a keyboard observer and an inset flag across view recycling, so a modal opened after a keyboard interaction scrolls into empty space. I traced it in production, reduced it to a three-file reproducer with an automated detector, confirmed it on the latest stable release, and filed it upstream.',
		links: [
			{ href: 'https://github.com/facebook/react-native/issues/57755', label: 'The issue' },
			{ href: 'https://github.com/PragathiJ/rn-aaki-recycle-repro', label: 'Reproducer' },
		],
	},
];

export const BUILDING: string[] = [
	'Evidence-Grounded Nutrition Research Copilot. Retrieval and citation design for nutrition evidence, built to refuse questions the sources cannot answer.',
	'Cycle-aware nutrition flow. Symptom and phase aware planning, scoped to stay non-medical.',
];
