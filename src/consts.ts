export const SITE_TITLE = 'Pragathi Jayaram';
export const SITE_DESCRIPTION =
	'Production AI, mobile engineering, and the evidence behind both. Articles and project notes by Pragathi Jayaram, an AI/ML engineer based in Germany.';

export const DEFAULT_OG_IMAGE = '/og-default.png';

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
