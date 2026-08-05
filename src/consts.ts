export const SITE_TITLE = 'Pragathi Jayaram';
export const SITE_DESCRIPTION =
	'Applied AI systems consultant, product engineer and founder with 10 years across production AI, mobile and backend systems. Notes on what it takes to ship.';

export const DEFAULT_OG_IMAGE = '/og-default.png';

// Feeds the Person node in the structured data. Not rendered anywhere on screen.
export const AUTHOR = {
	name: 'Pragathi Jayaram',
	jobTitle: 'Applied AI systems consultant and product engineer',
	description:
		'Applied AI systems consultant, product engineer and founder with 10 years across production AI, mobile and backend systems.',
	knowsAbout: [
		'Applied AI',
		'Large language model systems',
		'Machine learning engineering',
		'Computer vision',
		'React Native',
		'Mobile engineering',
		'Backend engineering',
		'FastAPI',
		'PostgreSQL',
		'Product engineering',
	],
	alumniOf: 'Technical University of Munich',
} as const;

export const CONTACT_EMAIL = 'hello@pragathijayaram.com';

export const NAV = [
	{ href: '/articles', label: 'Articles' },
	{ href: '/portfolio', label: 'Portfolio' },
	{ href: '/services', label: 'Work with me' },
	{ href: '/about', label: 'About' },
] as const;

export const SOCIAL = {
	github: 'https://github.com/PragathiJ',
	linkedin: 'https://www.linkedin.com/in/pragathi-jayaram/',
} as const;

export const FOOTER_LINKS = [
	{ href: '/impressum', label: 'Impressum' },
	{ href: '/datenschutz', label: 'Datenschutz' },
	{ href: '/contact', label: 'Contact' },
	{ href: '/rss.xml', label: 'RSS' },
] as const;
