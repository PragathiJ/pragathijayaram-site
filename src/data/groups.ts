export interface Group {
	id: string;
	name: string;
	blurb: string;
}

export interface PlannedArticle {
	group: string;
	title: string;
}

export const GROUPS: Group[] = [
	{
		id: 'ai-that-has-to-be-right',
		name: 'AI That Has to Be Right',
		blurb:
			'Building LLM and ML features for domains where a confident wrong answer costs more than no answer at all.',
	},
	{
		id: 'production-engineering',
		name: 'Production Engineering',
		blurb: 'Debugging and shipping mobile and backend systems that are already in users’ hands.',
	},
	{
		id: 'building-in-a-regulated-space',
		name: 'Building in a Regulated Space',
		blurb: 'Privacy, consumer law and tax treated as engineering constraints, handled by one person.',
	},
];

export const GROUP_IDS = GROUPS.map((g) => g.id) as [string, ...string[]];

export const PLANNED: PlannedArticle[] = [
	{
		group: 'ai-that-has-to-be-right',
		title: 'Structured data as the guardrail: a nutrition feature that cannot hallucinate',
	},
	{
		group: 'production-engineering',
		title:
			'The bug that survived being recycled: automaticallyAdjustKeyboardInsets and Fabric view recycling on iOS',
	},
	{
		group: 'production-engineering',
		title: 'Recurring logout forensics: global sign-out and a Keychain accessibility flag',
	},
	{
		group: 'production-engineering',
		title: 'Not every 401 means goodbye: classifying refresh failures',
	},
	{ group: 'building-in-a-regulated-space', title: 'DPIA with a team of one' },
	{
		group: 'building-in-a-regulated-space',
		title: 'GDPR-first architecture: the decisions you make at schema time',
	},
	{ group: 'building-in-a-regulated-space', title: 'Freiberufler vs Gewerbe, side by side' },
];

export function getGroup(id: string): Group | undefined {
	return GROUPS.find((g) => g.id === id);
}
