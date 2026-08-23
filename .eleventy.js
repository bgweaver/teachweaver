module.exports = function (eleventyConfig) {
  // Copy static assets straight through to the output folder, untouched.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  // Only publish real image formats. Keeps editable sources (.xcf, .psd) and
  // anything else in that folder out of the deployed site.
  eleventyConfig.addPassthroughCopy("src/images/**/*.{jpg,jpeg,png,gif,avif,webp,svg,ico}");
  eleventyConfig.addPassthroughCopy("src/images/**/*.webmanifest");
  eleventyConfig.addPassthroughCopy("src/webfonts");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Projects and lab entries are files you drop in a folder, same as blog posts.
  // They render as cards on projects.html / lab.html, not as their own pages.
  // "order" in the frontmatter controls position (low number = first).
  eleventyConfig.addCollection("projects", (collection) =>
    collection.getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  eleventyConfig.addCollection("lab", (collection) =>
    collection.getFilteredByGlob("src/lab/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  return {
    // Only .njk files are templates for now. Raw .html files (like the
    // not-yet-converted posts) are left alone and passthrough-copied as-is.
    templateFormats: ["njk", "md", "11ty.js"],
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
