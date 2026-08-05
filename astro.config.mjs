// @ts-check

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Pages whose content lives in more than one file take the newer of the two.
// Layouts and components are deliberately absent: a change to the header or the
// author block is not a change to what a page says, and claiming otherwise
// teaches Google to ignore lastmod on this site.
const PAGE_SOURCES = {
	'': ['src/pages/index.astro'],
	about: ['src/pages/about.astro'],
	portfolio: ['src/pages/portfolio.astro', 'src/data/portfolio.ts'],
	services: ['src/pages/services.astro', 'src/data/services.ts'],
	articles: ['src/pages/articles/index.astro', 'src/data/groups.ts'],
	contact: ['src/pages/contact.astro'],
	impressum: ['src/pages/impressum.astro'],
	datenschutz: ['src/pages/datenschutz.astro'],
};

function lastCommit(paths) {
	let latest = null;
	for (const path of paths) {
		try {
			const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', path], {
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
			}).trim();
			if (!out) continue;
			const date = new Date(out);
			if (!latest || date > latest) latest = date;
		} catch {
			// No git, or a shallow clone without this file's history. Better to omit
			// lastmod than to invent one.
		}
	}
	return latest;
}

// Articles declare their own dates, and updatedDate is an explicit statement that
// the piece changed materially, which is exactly what lastmod is supposed to mean.
const articleDates = (() => {
	const dir = 'src/content/articles';
	const dates = new Map();
	for (const file of readdirSync(dir)) {
		if (!/\.mdx?$/.test(file)) continue;
		const frontmatter = readFileSync(`${dir}/${file}`, 'utf8').split('---')[1] ?? '';
		const field = (key) =>
			frontmatter.match(new RegExp(`^${key}:\\s*['"]?([0-9T:.Z+-]+)`, 'm'))?.[1];
		const raw = field('updatedDate') ?? field('pubDate');
		if (raw) dates.set(file.replace(/\.mdx?$/, ''), new Date(raw));
	}
	return dates;
})();

// https://astro.build/config
export default defineConfig({
	site: 'https://pragathijayaram.com',
	integrations: [
		mdx(),
		sitemap({
			serialize(item) {
				const path = new URL(item.url).pathname.replace(/^\/|\/$/g, '');
				const date = path.startsWith('articles/')
					? articleDates.get(path.slice('articles/'.length))
					: lastCommit(PAGE_SOURCES[path] ?? []);
				if (date) item.lastmod = date.toISOString();
				return item;
			},
		}),
	],
});
