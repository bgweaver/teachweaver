# What's left

Updated after the favicon, buttons, photos, and contact-form round.

---

## Do this first

These two are the difference between "works" and "actually good."

- [ ] **Compress the photos.** They're still 1-2MB each. The projects page currently pulls something like
      10MB, which is a bad first impression on mobile.

      ```
      ./tools/optimize.sh src/images/*.JPG src/images/*.jpg
      ```

      This also lowercases `.JPG` to `.jpg`, which matters: the project files reference `clock.jpg` and
      `clock-scattered.jpg` lowercase. On a case-sensitive server those 404 until you run this.

- [ ] **Copy the newest files into your repo.** Since you merged, these have been added or changed:
      `netlify.toml`, `tools/optimize.sh`, `tools/make-button.py`, `src/images/favicon/*`,
      `src/images/buttons/*` (15 files), `src/_data/badges.json`, plus edits to `src/about.njk`,
      `src/projects.njk`, `src/_includes/base.njk`, `src/css/styles.css`, and several `src/projects/*.md`.
      Easiest is to unzip over the top and let `git status` show you the diff.

---

## Verify after the next deploy

- [ ] **Contact form.** It was white-on-white and unreadable. Type in it and confirm you can see the text.
- [ ] **Favicon.** Should be a grey spider web in the browser tab. Hard-refresh; favicons cache hard.
- [ ] **The project photos actually load.** Especially the two clock images, per the case-sensitivity note.
- [ ] **RSS.** Add `https://www.teachweaver.com/feed.xml` to Miniflux. It's new and has never been tested
      against a real reader.
- [ ] **The `netlify.toml` took effect.** If the deploy log still shows no build command, the file isn't in
      the repo root next to `package.json`.

---

## Small stuff

- [ ] **Verify the site on Mastodon.** Add `https://www.teachweaver.com` to a metadata field on your
      profile. The `rel="me"` half is already on the site, so this is the only remaining step to get the
      green checkmark.
- [ ] **Two projects still have no photo:** "This Site" and "Small Tools & Experiments." Both read fine
      text-only, so this is optional.
- [ ] **Header image for the Homarr post.** It still points at `og-image.jpg`. A screenshot of your
      dashboard would be the obvious one.

---

## Decisions only you can make

- [ ] **Four post titles changed** when I stripped "Journey" out of them. URLs are unchanged so nothing
      broke, but the visible titles are different: the CompTIA post, the CSS post, the programming post,
      and the home network post.
- [ ] **Four posts had a title or date mismatch** between the old `posts.json` and the post itself. I used
      the post page as truth in each case: `summer-break-server-project`, `upgrading-my-home-network`,
      `bubbles-fur-website`, `net-chan`.
- [x] **Keep the local-government work off the site.** Decided: the site gets linked to work, so the
      council-meeting and records-request side stays off. Don't re-add it.

- [ ] **Keep "Currently" current.** `src/_data/currently.json`, three cards on the homepage. It's the most
      likely thing to go stale and make the site look abandoned.

---

## Parked, say the word

- **GitHub activity on the site.** Usual approach is a third-party SVG service, which means every visitor
  hits someone else's server. Given the Tor and privacy badges next to it, I didn't add it unasked.
  Alternative is pulling your public repos client-side from GitHub's own API.
- **Live BookWyrm "currently reading."** Right now it's just a button linking to your profile. A real
  fetch may work now that I have your handle, though it may hit CORS.
- **A webring or links page.** Fits the button-wall aesthetic if you ever want somewhere to point at other
  people's sites.
- **Self-hosted badge** goes back on if you move this off Netlify to the VPS.
