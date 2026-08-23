# How to write a new blog post

Everything you need is in `src/posts/`. A post is one markdown file. That's it.

---

## The short version

1. Make a new file: `src/posts/my-post-name.md`
2. Paste in the template below, fill it out
3. Write the post in plain markdown underneath
4. Commit and push. Netlify rebuilds automatically.

The filename becomes the URL. `my-post-name.md` → `teachweaver.com/posts/my-post-name/`
Use lowercase, dashes instead of spaces, no special characters.

---

## Copy-paste template

```
---
title: "teachweaver: SHORT TITLE"
postTitle: "SHORT TITLE"
date: 2026-08-23
postDate: "August 23, 2026"
description: "One sentence for Google search results."
ogTitle: "SHORT TITLE - teachweaver"
ogDescription: "One sentence for social media link previews."
ogImage: "https://www.teachweaver.com/images/YOUR-IMAGE.jpg"
ogUrl: "https://www.teachweaver.com/posts/my-post-name/"
image: "/images/YOUR-IMAGE.jpg"
imageAlt: "Short description of the image"
listDescription: "The blurb that shows on the blog listing page. A sentence or two."
---

Write the post here in markdown.
```

### What each field does

| Field | Where it shows up |
|---|---|
| `title` | Browser tab / bookmark name |
| `postTitle` | The big heading at the top of the post, and the card title on the blog page |
| `date` | **Sorting only.** Must be `YYYY-MM-DD` with no quotes. Newest posts go to the top of the blog. |
| `postDate` | The date people actually see, written however you like |
| `description` | Google search snippet |
| `ogTitle` / `ogDescription` | Text in Discord/Slack/Twitter link previews |
| `ogImage` | Picture in link previews — needs the **full** `https://www.teachweaver.com/...` URL |
| `ogUrl` | Full URL of this post. Match the filename. |
| `image` | Thumbnail on the blog listing page — site-relative, starts with `/images/` |
| `imageAlt` | Alt text for that thumbnail (screen readers) |
| `listDescription` | The preview blurb on the blog listing page |

Author and keywords are set automatically — you don't need them in the file.

---

## Adding pictures

**Step 1 — put the image file in `src/images/`**

Any name works. Lowercase with dashes is easiest. `.jpg`, `.png`, `.avif`, and `.webp` all work.

**Step 2 — reference it**

Everywhere in the site, images start with `/images/` — not `../images/`, not `images/`.
The leading slash matters; it's what lets posts live in subfolders without breaking.

For the **header/thumbnail image** (shows on the blog listing card), set it in the frontmatter:

```
image: "/images/my-picture.jpg"
imageAlt: "What the picture shows"
ogImage: "https://www.teachweaver.com/images/my-picture.jpg"
```

For an image **inside the post body**, just use markdown:

```
![What the picture shows](/images/my-picture.jpg)
```

If you want it centered and styled like the ones in your older posts, use HTML instead —
markdown files accept raw HTML anywhere:

```html
<figure class="wp-block-image size-large text-center">
  <img src="/images/my-picture.jpg" alt="What the picture shows"
       class="img-fluid rounded mx-auto d-block" style="max-width: 100%; height: auto;" />
</figure>
```

**Keep file sizes down.** Anything over ~500KB will noticeably slow the page.
[Squoosh](https://squoosh.app/) resizes and compresses in the browser — you already
used it on the Sweet Speech build.

---

## Writing the body

Plain markdown. No HTML needed unless you want it.

```
## A heading

Normal paragraph text. **Bold** and *italic* work.

- bullet
- another bullet

1. numbered
2. list

[A link](https://example.com)

`inline code`
```

For a code block, fence it with three backticks and name the language:

    ```python
    print("hello")
    ```

Raw HTML works too, if you need something markdown can't do.

---

## Previewing before you publish

```
npm run serve
```

Open the `localhost` URL it prints. It rebuilds as you save, so you can leave it running
while you write.

**Don't open the HTML files directly** (double-clicking, `file:///...`). Images and CSS
will all appear broken, because the site uses root-relative paths that need a real server.
This is only a local-preview quirk — it works fine once deployed.

---

## Publishing

```
git add .
git commit -m "New post: whatever"
git push
```

Netlify sees the push, runs `npm run build`, and deploys. Takes about a minute.

### From your phone

Same thing, no terminal needed:

1. Open the repo in the GitHub app (or github.com in a browser)
2. Navigate to `src/posts/`
3. **Add file → Create new file**
4. Name it `something.md`, paste the template, write the post
5. Commit

For pictures, upload them to `src/images/` the same way first, then reference them.

---

## If something breaks

**Post doesn't appear on the blog page.** Check that `date` is `YYYY-MM-DD` with no quotes.
A malformed date is the usual culprit.

**Build fails.** Look at the frontmatter — every value with a colon, apostrophe, or quote
inside it needs to be wrapped in double quotes. That's the most common cause.

**Images 404.** Path needs to start with `/images/`, and the file has to actually be in
`src/images/`. Capitalization matters.

---

## Where everything lives

```
src/
  index.njk          Homepage
  about.njk          About page
  blog.njk           Blog listing (posts load automatically — don't edit for new posts)
  lab.njk            Lab page (widgets)
  posts/             One .md file per post
  images/            All pictures
  css/  js/          Styles and scripts
  _includes/
    base.njk         <head>, scripts — shared by every page
    navbar.njk       Navigation bar — edit once, changes everywhere
    footer.njk       Footer — same
    post.njk         The wrapper every blog post gets
  posts.11ty.js      Auto-generates posts.json. Never edit posts.json by hand.
```

The old workflow had you hand-editing `posts.json` every time. It's generated now — 13 of
your 17 old posts had a title or date in that file that didn't match the actual post,
which is exactly what that kind of manual duplication causes.

---

# Updating the rest of the site

Three things beyond blog posts are now file-driven. You never edit the page templates for these —
you add or edit a file and rebuild.

## "Currently" on the homepage

Edit **`src/_data/currently.json`**. It's a list of three-ish cards:

```json
[
  {
    "title": "Server Upgrades",
    "icon": "fas fa-server",
    "text": "One or two sentences about what you're doing."
  }
]
```

Add, remove, or reorder entries freely. `icon` is any
[Font Awesome](https://fontawesome.com/search?o=r&m=free) class — or delete the line for no icon.

**Watch the commas.** Every entry needs a comma after its closing `}` except the last one. That's
the one thing that will break the build here.

## Projects

One file per project in **`src/projects/`**. Same idea as blog posts.

```
---
name: "Solar Mesh Node"
category: "Hardware & Electronics"
icon: "fas fa-satellite-dish"
order: 2
image: "/images/mesh-node.jpg"
imageAlt: "The node on the roof"
links:
  - label: "Read the build post"
    url: "/posts/some-post/"
  - label: "Source"
    url: "https://github.com/..."
---
Write the description here. Markdown works.
```

- **`category`** creates the section headings. Reuse an existing one to file it there, or invent a new
  one and a new section appears automatically. Current categories: Hardware & Electronics,
  Software & Web, Made by Hand.
- **`order`** controls position (lower = earlier). Categories appear in the order their first project does.
- **`image`** is optional — leave it as `""` and the card is text-only. Add a path and you get a
  photo at the top of the card, clickable to full size.
- **`links`** is optional — each becomes a button. Use `links: []` for none.

## Lab widgets

One file per widget in **`src/lab/`**.

```
---
name: "My Widget"
order: 3
width: "col-lg-10"
---
A sentence or two explaining what it is.

<div id="my-widget">...any HTML you want...</div>

<script>
  // any JavaScript you want
</script>
```

The body is raw HTML and JavaScript, so anything you can build in a single file works — canvas
toys, embeds, iframes, calculators. Use `width: "col-lg-10"` for wide things and `col-lg-8`
(the default) for narrow ones.

**Give your IDs and variables a unique prefix** (`ulam-canvas`, not `canvas`). Every widget shares
one page, so generic names will collide with the next widget you add.

## Badges and "currently reading" (About page)

**`src/_data/badges.json`** is the 88x31 button wall.

```json
[
  { "image": "/images/buttons/eff.gif", "alt": "EFF", "url": "https://www.eff.org/" },
  { "image": "/images/buttons/no-ai.gif", "alt": "Written by a human", "url": "" }
]
```

Drop the .gif in `src/images/buttons/` and add an entry. Empty `"url": ""` makes it a
non-clickable badge instead of a link.

The buttons currently in there are **placeholders I generated** so the wall wouldn't be a row of broken
images. Replace them with the real ones as you collect them. Most projects that offer a button have it on
their site somewhere, and there are archives of classic 88x31s if you want to browse.

Badges currently in there are **placeholders I generated** so the wall wouldn't be broken images.
Swap them for real ones as you collect them.

---

# Auto-generated files (don't edit by hand)

| File | What it is |
|---|---|
| `posts.json` | Feeds the blog listing. Built from your post frontmatter. |
| `sitemap.xml` | Every page and post, for search engines. Rebuilt each time. |
| `feed.xml` | RSS feed. Add it to Miniflux to check it works. |

All three regenerate on every build from `src/posts.11ty.js`, `src/sitemap.11ty.js`, and
`src/feed.11ty.js`. Editing the output does nothing since it gets overwritten.
