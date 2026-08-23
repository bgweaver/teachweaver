module.exports = class {
  data() {
    return {
      permalink: "/posts.json",
      eleventyExcludeFromCollections: true
    };
  }

  render({ collections }) {
    const posts = collections.posts
      .slice()
      .reverse() // Eleventy collections sort oldest -> newest by default
      .map((post) => ({
        title: post.data.postTitle,
        image: post.data.image,
        alt: post.data.imageAlt,
        description: post.data.listDescription,
        author: post.data.author,
        date: post.data.postDate,
        link: post.url
      }));

    return JSON.stringify(posts, null, 2);
  }
};
