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
			'Engineering AI systems for domains where a confident wrong answer can be more costly than no answer at all.',
	},
	{
		id: 'production-engineering',
		name: 'Production Engineering',
		blurb:
			'Technical investigations into the architecture, failures and release work behind mobile and backend systems used in the real world.',
	},
	{
		id: 'building-in-a-regulated-space',
		name: 'Building in a Regulated Space',
		blurb:
			'Treating privacy, consumer law and regulatory requirements as product and engineering constraints, not final-stage paperwork.',
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
