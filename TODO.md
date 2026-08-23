# Human-only jobs

Things I can't do for you, roughly in order of what unblocks the most.

---

## Ship it

- [ ] **Merge into the real repo.** Delete the old `css/ js/ images/ webfonts/ posts/ index.html
      about.html blog.html posts.json sitemap.xml robots.txt` from the repo root, copy in `src/`,
      `.eleventy.js`, `package.json`, `POSTING.md`, `TODO.md`. Check `git status` before committing.
- [ ] **Add a `.gitignore`** with `node_modules` and `_site` if there isn't one. Both are generated.
- [ ] **Change Netlify's build settings.** Build command `npm run build`, publish directory `_site`.
      Nothing else about the Netlify setup changes.
- [ ] **Test the contact form once after deploy.** It moved from the homepage to `/about.html#contact`.
      Netlify Forms detects forms at build time, so confirm a real submission lands.
- [ ] **Check old URLs still work.** All 17 post URLs are unchanged, but `/contact.html` briefly existed
      and is now gone. If anything linked to it, it needs a redirect to `/about.html#contact`.

---

## Pictures

Every project card works without a photo, but the ones with photos look considerably better. Current state:

**Has a photo already:** Valiant Inquiry, Sweet Speech, Bubbles & Fur, Yard Art, Earlier Sites

**Wants a photo (just a phone snap is fine):**

- [ ] **Spartus clock** — the finished clock, ideally. A teardown shot of the original guts would be even
      better if you still have those photos from before you gutted it.
- [ ] **Solar mesh node** — the node on the roof, or in hand before it went up.
- [ ] **ESP32 projects** — a messy desk shot with boards and a soldering iron reads better here than
      anything staged.
- [ ] **The homelab** — the rack/tower. Blinkenlights photograph well.
- [ ] **Coin rings** — the finished ring on your hand, and/or the quarter mid-process.
- [ ] **Bleach shirts** — one of the finished shirts laid flat.
- [ ] **This site** — optional, a screenshot is a bit self-referential.

Add them with `image: "/images/whatever.jpg"` in the project's file. Run them through
[Squoosh](https://squoosh.app/) first; anything over ~500KB will drag the page.

- [ ] **Header images for the two new posts.** Both currently point at `og-image.jpg` as a placeholder.
      The R420 post especially wants a photo of the server with its lid off.
- [ ] **A favicon.** The site has never had one, so browser tabs show a blank page icon. A 32x32 and a
      180x180 apple-touch-icon would cover it. Tell me when the files exist and I'll wire them into `base.njk`.

---

## Badges

- [ ] **Replace my placeholder buttons.** The nine on the About page are ones I generated so the wall
      wasn't broken images. Most projects that offer a real 88x31 have it somewhere on their site, and
      there are archives of classic ones worth browsing.
- [ ] **Decide on a "self-hosted" badge after the VPS move.** I pulled it because the site is on Netlify
      right now and it would have been a lie. If you migrate, it goes back.
- [ ] **Make your own teachweaver button properly.** Mine is a placeholder. Yours is the one other people
      would actually put on their sites.

---

## Accounts

- [ ] **Verify the site on Mastodon.** Add `https://www.teachweaver.com` to a metadata field on your
      profile. The site already has `rel="me"` on the Mastodon links, so Mastodon will check for the link
      back and show a green checkmark. Only works once both halves exist.
- [ ] **Subscribe to your own feed in Miniflux** at `https://www.teachweaver.com/feed.xml` to confirm it
      parses. It's new and untested against a real reader.

---

## Content decisions only you can make

- [ ] **Four posts had a title or date in the old `posts.json` that didn't match the post itself.** I made
      the post page the source of truth in every case. Worth a look in case any should go the other way:
      `summer-break-server-project`, `upgrading-my-home-network`, `bubbles-fur-website`, `net-chan`.
- [ ] **Four post titles that contained "Journey" got renamed.** URLs unchanged, so nothing broke, but
      the visible titles are different: the CompTIA post, the CSS post, the programming post, and the
      home network post.
- [ ] **Decide whether the ALPR work goes on the site.** It's arguably your strongest project and it's
      currently not mentioned anywhere. I left it off because you said allude, don't claim. Still worth
      a deliberate decision rather than a default.
- [ ] **Keep "Currently" current.** `src/_data/currently.json` is three cards on the homepage. It's the
      thing most likely to quietly go stale and make the site look abandoned. If it's still saying the
      same three things in six months, either update it or cut the section.

---

## Open questions I parked

- **GitHub activity widget.** The usual option is a third-party service that renders an SVG card, which
  means every visitor's browser hits someone else's server. Given the Tor and privacy badges on the same
  page, I didn't add it without asking. Alternatives: pull your public repos client-side from GitHub's own
  API, or leave the plain link.
- **Live BookWyrm "currently reading".** The data is public and reachable, but a browser-side fetch may be
  blocked by CORS depending on the instance. Now that I have your profile, I can test it if you want more
  than the badge.
