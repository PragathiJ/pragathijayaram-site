import { getCollection, type CollectionEntry } from 'astro:content';
import type { Row } from '../components/ArticleRow.astro';
import { GROUPS, PLANNED } from '../data/groups';

export type Article = CollectionEntry<'articles'>;

export function articleHref(article: Article): string {
	return `/articles/${article.id}/`;
}

export async function getPublishedArticles(): Promise<Article[]> {
	const articles = await getCollection(
		'articles',
		({ data }) => import.meta.env.DEV || !data.draft,
	);
	return articles.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// Picks the featured ids in order, then fills up to `count` with the newest
// article from a group not yet shown, so each slot covers a different group.
export function selectFeatured(articles: Article[], ids: string[], count = 3): Article[] {
	const byId = new Map(articles.map((article) => [article.id, article]));
	const picked = ids.map((id) => byId.get(id)).filter((a): a is Article => !!a).slice(0, count);
	const groups = new Set(picked.map((article) => article.data.group));

	for (const article of articles) {
		if (picked.length >= count) break;
		if (picked.includes(article) || groups.has(article.data.group)) continue;
		picked.push(article);
		groups.add(article.data.group);
	}
	return picked;
}

export function toRow(article: Article): Row {
	return {
		title: article.data.title,
		href: articleHref(article),
		description: article.data.description,
		date: article.data.pubDate,
		type: article.data.type,
	};
}

export function rowsByGroup(articles: Article[]): Map<string, Row[]> {
	const rows = new Map<string, Row[]>(GROUPS.map((group) => [group.id, []]));

	for (const article of articles) {
		rows.get(article.data.group)?.push(toRow(article));
	}

	// A planned entry stays listed until its article publishes. In dev, where
	// drafts render, skip the planned row so the title is not shown twice.
	const published = new Set(articles.map((article) => article.data.title));

	for (const planned of PLANNED) {
		if (published.has(planned.title)) continue;
		rows.get(planned.group)?.push({ title: planned.title });
	}

	return rows;
}
