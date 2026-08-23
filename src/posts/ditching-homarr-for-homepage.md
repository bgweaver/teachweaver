---
title: "teachweaver: Ditching Homarr for Homepage"
postTitle: "Ditching Homarr for Homepage"
date: 2026-07-27
postDate: "July 27, 2026"
description: "Why I moved my everywhere-dashboard off Homarr and onto gethomepage, and what's still left before it fully replaces the old one."
ogTitle: "Ditching Homarr for Homepage - teachweaver"
ogDescription: "Why I moved my everywhere-dashboard off Homarr and onto gethomepage, and what's still left before it fully replaces the old one."
ogImage: "https://www.teachweaver.com/images/homarr.png"
ogUrl: "https://www.teachweaver.com/posts/ditching-homarr-for-homepage/"
image: "/images/homarr.png"
imageAlt: "A self-hosted dashboard"
listDescription: "I've used Homarr as my browser homepage for a while, but I finally got around to trialing gethomepage as a replacement. Here's how the migration went."
---

I've been using Homarr as my browser homepage on every device, home and away, for a while now. It works, but
it's always felt heavier than it needs to be for what I actually want: a fast landing page with links to
everything running in my homelab, plus a couple of live status tiles.

This week I finally sat down and trialed [gethomepage](https://gethomepage.dev/) as a replacement. It's a
single YAML-configured container instead of a database-backed app, which appealed to me. I'd rather edit a
text file than click through a settings UI.

## Getting it running

Homepage lives as another service in my existing docker-compose stack, config split across a few YAML files: services, bookmarks, widgets, and a docker.yaml that mounts the Docker socket so it can show live container
status right on the tiles. Secrets (API keys, tokens) stay out of the YAML entirely. They live in a `.env`
file and get passed in as environment variables, so nothing sensitive ends up committed anywhere.

I split it into two tabs: Home and Work. Work holds the handful of links I actually need during the school
day; Home is everything else: media, downloads, monitoring, the works.

## The rough edges

Not everything went smoothly. A couple of widgets (Proxmox, Mealie) fought me hard enough that I gave up and
just kept them as plain links instead of live-status tiles. Sometimes "good enough" beats "correct." I also
hit a genuinely strange Proxmox API authentication failure that I never fully ran down; the token tested fine
from the command line but Homepage's widget kept getting rejected. Filed away for later.

On the plus side, reordering the layout (Quick Links and my crypto tile up top) just worked, no fighting
the config to get there.

## What's left

Right now Homepage is still LAN-only. The last piece before it can fully replace Homarr as my actual
everywhere-homepage is wiring up remote access properly, so it's reachable the same way whether I'm on my
home network or not. Once that's done, Homarr gets retired.

I also added a small XMRig widget pointed at my mining rig's API, so I can see hashrate at a glance. More on that mining setup in a future post.
