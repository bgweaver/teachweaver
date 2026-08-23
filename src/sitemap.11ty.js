// Auto-generated sitemap. Lists every real page plus every blog post.
module.exports = class {
  data() {
    return { permalink: "/sitemap.xml", eleventyExcludeFromCollections: true };
  }

  render({ collections }) {
    const site = "https://www.teachweaver.com";
    const today = new Date().toISOString().split("T")[0];

    const pages = [
      { url: "/", priority: "1.00" },
      { url: "/about.html", priority: "0.80" },
      { url: "/projects.html", priority: "0.80" },
      { url: "/blog.html", priority: "0.80" },
      { url: "/lab.html", priority: "0.60" }
    ].map((p) => ({ loc: site + p.url, lastmod: today, priority: p.priority }));

    const posts = (collections.posts || []).map((p) => ({
      loc: site + p.url,
      lastmod: p.date.toISOString().split("T")[0],
      priority: "0.64"
    }));

    const entries = [...pages, ...posts]
      .map(
        (e) =>
          `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  }
};
