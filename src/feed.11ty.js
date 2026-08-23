// RSS feed of all blog posts.
module.exports = class {
  data() {
    return { permalink: "/feed.xml", eleventyExcludeFromCollections: true };
  }

  render({ collections }) {
    const site = "https://www.teachweaver.com";
    const esc = (s) =>
      String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const posts = (collections.posts || []).slice().reverse();
    const items = posts
      .map(
        (p) => `  <item>
    <title>${esc(p.data.postTitle)}</title>
    <link>${site}${p.url}</link>
    <guid isPermaLink="true">${site}${p.url}</guid>
    <pubDate>${p.date.toUTCString()}</pubDate>
    <description>${esc(p.data.listDescription || p.data.description)}</description>
  </item>`
      )
      .join("\n");

    const updated = posts.length ? posts[0].date.toUTCString() : new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>teachweaver</title>
  <link>${site}</link>
  <description>Homelab, hardware, and learning things by building them.</description>
  <language>en-us</language>
  <lastBuildDate>${updated}</lastBuildDate>
  <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>
`;
  }
};
