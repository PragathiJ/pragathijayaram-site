<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="utf-8" indent="yes" />
	<xsl:template match="/">
		<html lang="en">
			<head>
				<title><xsl:value-of select="/rss/channel/title" /> · RSS</title>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<style>
					:root {
						--bg: #fbfbfa; --surface: #f2f4f2; --ink: #1b221e;
						--muted: #5a675f; --accent: #12694f; --hairline: #e3e7e3;
					}
					@media (prefers-color-scheme: dark) {
						:root {
							--bg: #0f1411; --surface: #161d18; --ink: #e4eae5;
							--muted: #93a399; --accent: #58c398; --hairline: #242c27;
						}
					}
					body {
						margin: 0 auto; max-width: 42rem; padding: 3rem 1.25rem 4rem;
						background: var(--bg); color: var(--ink); line-height: 1.6;
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					}
					h1, h2 {
						font-family: Charter, 'Iowan Old Style', Georgia, serif;
						font-weight: 600; line-height: 1.25; margin: 0 0 0.5rem;
					}
					h1 { font-size: 2rem; }
					h2 { font-size: 1.25rem; }
					a { color: var(--accent); text-underline-offset: 0.15em; }
					p { margin: 0 0 1em; }
					.note {
						background: var(--surface); border: 1px solid var(--hairline);
						border-radius: 4px; padding: 1rem; margin-bottom: 2.5rem;
						color: var(--muted); font-size: 0.9375rem;
					}
					.note p:last-child { margin-bottom: 0; }
					article {
						padding-block: 1.25rem; border-bottom: 1px solid var(--hairline);
					}
					article h2 a { color: var(--ink); text-decoration: none; }
					article h2 a:hover { text-decoration: underline; }
					.date {
						font-size: 0.875rem; color: var(--muted);
						font-variant-numeric: tabular-nums; margin-bottom: 0.35rem;
					}
					.description { color: var(--muted); margin: 0; }
					footer { margin-top: 2.5rem; font-size: 0.875rem; color: var(--muted); }
				</style>
			</head>
			<body>
				<h1><xsl:value-of select="/rss/channel/title" /></h1>
				<p class="description"><xsl:value-of select="/rss/channel/description" /></p>

				<div class="note">
					<p>
						This is an RSS feed. Paste this page's address into a feed reader to
						follow new articles without email or an algorithm deciding what you see.
					</p>
					<p>
						Prefer to read on the site?
						<a>
							<xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>
							Go to <xsl:value-of select="/rss/channel/link" />
						</a>
					</p>
				</div>

				<xsl:for-each select="/rss/channel/item">
					<article>
						<h2>
							<a>
								<xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
								<xsl:value-of select="title" />
							</a>
						</h2>
						<p class="date"><xsl:value-of select="substring(pubDate, 6, 11)" /></p>
						<p class="description"><xsl:value-of select="description" /></p>
					</article>
				</xsl:for-each>

				<footer>
					<a>
						<xsl:attribute name="href"><xsl:value-of select="/rss/channel/link" /></xsl:attribute>
						<xsl:value-of select="/rss/channel/title" />
					</a>
				</footer>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
