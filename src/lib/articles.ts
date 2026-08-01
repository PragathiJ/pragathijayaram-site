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

	for (const planned of PLANNED) {
		rows.get(planned.group)?.push({ title: planned.title });
	}

	return rows;
}
