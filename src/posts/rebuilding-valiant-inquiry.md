---
title: "teachweaver: Rebuilding Valiant Inquiry for Year Two"
postTitle: "Rebuilding Valiant Inquiry for Year Two"
date: 2026-08-23
postDate: "August 23, 2026"
description: "The classroom achievement app I built last year barely got used. Here's the rebuild: no student logins, class-based points, and an AI ship's log that never sees a real student name."
ogTitle: "Rebuilding Valiant Inquiry for Year Two - teachweaver"
ogDescription: "The classroom achievement app I built last year barely got used. Here's the rebuild: no student logins, class-based points, and an AI ship's log that never sees a real student name."
ogImage: "https://www.teachweaver.com/images/valiant2.jpg"
ogUrl: "https://www.teachweaver.com/posts/rebuilding-valiant-inquiry/"
image: "/images/valiant2.jpg"
imageAlt: "The Valiant Inquiry bridge view"
listDescription: "The classroom achievement app I built last year barely got used. The rebuild throws out student logins entirely and moves everything to the projector."
---

Last year I built a space-themed achievement tracker for my classroom called M.O.S. Valiant Inquiry.
Students had pseudonyms and PINs, logged in individually, and earned achievements. I wrote a whole post
about it. Then I used it maybe five times all year.

The problem was structural. I teach science in one-hour blocks to four different classes. There is no
version of that hour where twenty-six kids log into a website and anything productive happens afterward.
Every minute spent on "I forgot my PIN" is a minute not spent on science. The app worked fine. The app was
just wrong for the room.

So this summer I tore it down and rebuilt it around one rule: **students never log in.**

## Three screens instead of twenty-six

The new version has three surfaces and only one of them belongs to a student.

**The bridge** runs on the projector. It's what the class sees: crew standings, the day's event, a
countdown timer when we need one. It updates live over server-sent events, so when I tap something on my
phone the projector changes immediately with no refresh.

**The remote** runs on my phone. Points, events, the student picker, all of it. It's a PWA, so it installs
to my home screen and behaves like an app. This is the part that actually made the difference. Awarding
points now takes a thumb, not a walk to the desk.

**The console** is the admin side, where rosters and settings live. Students never see it.

## Points that belong to the crew

The old version tracked individuals. The new one tracks classes, which I name after their homeroom folder
colors: Green Crew, Orange Crew, Blue Crew, Yellow Crew.

There are two currencies. **Renown** is cumulative and never goes down, so a crew that has a bad week is
still climbing. **Power Cells** are spendable, so there's something to actually do with a good week. A crew
can bank cells and spend them on powers, which are the sort of thing you'd expect: skip a question, extend a
deadline, make me do something undignified.

Splitting the two fixed a problem I had with straight point systems. If the only number goes both up and
down, a crew that falls behind in September has no reason to care in April. Renown means the season-long
story is always additive, and cells carry the week-to-week stakes.

## The events, rewritten

I ran Classcraft years ago when I taught one class all day, and the thing I actually missed was the random
events. Silly stuff, rolled at the start of class, that made the day feel different from yesterday.

I dug the old event list out of my archive and rebuilt it from scratch, 44 events, with two hard rules:

**No table versus table.** The old list had events pitting groups against each other, and I cut every one.
The whole crew wins or the whole crew loses. I don't need a mechanic that gives four kids a reason to be
annoyed at four other kids for the rest of the hour.

**More individual spotlights.** Eleven of the events name one specific student. That's where the energy is.
Being singled out by the ship for something absurd is fun in a way that a crew-wide point adjustment isn't.

Some are procedural, like a customs inspection or a hull breach drill. Some are pure nonsense. One turns a
student into a butterfly. Another turns a student into a slug, except if I'm wearing the slug mask that day,
it turns *me* into the slug instead, and the slug mask is nearly impossible to see out of. I'll wear a wig.
I'll wear a tutu. I will not sing, so the karaoke event didn't survive the rewrite.

## The picker, and the roster problem

There's a random student picker on the remote. It doesn't repeat until it's been through everyone, which
matters more than it sounds. A truly random picker will call on the same kid three times in ten minutes and
skip another kid for two weeks, and both of those are noticed immediately.

Desks have seat letters A through D, and there's a rotating duty roster that maps letters to jobs so the
same kid isn't always the one collecting materials. Separately there's a list of ship's jobs I hand out by
name, mostly to the class I eat snack with.

## The ship's log, and the part I actually care about

At the end of the day I want a short log entry in the ship's voice, summarizing what happened in each class.
I feed it the day's events plus a couple of sentences of my own notes, and it writes the entry.

That means an LLM. I won't run one locally, since the Proxmox host has no GPU and I'm not standing up a
model service on my gaming PC. So it calls out to a hosted endpoint.

Which creates a problem. I want the log to use students' real first names, because "Kylie kept the reactor
stable" is worth something to a kid and "Student B kept the reactor stable" is worth nothing. But I am not
sending a class roster of real children's names to a third-party API. That's not a thing I'm willing to do,
and I'd argue it's not a thing any teacher should do casually.

The fix is pseudonymization. Before the request goes out, every real name on the roster is swapped for a
decoy star name. The API only ever sees the decoys. When the response comes back, the decoys are swapped
back to real names locally. The log reads correctly to my students, and the vendor's logs contain a story
about a crew of children who don't exist.

It's a simple trick and it took maybe an hour to get right, but it's the piece of this build I'd defend
hardest. The convenient version of this feature is a privacy problem you hand to twenty-six families who
never agreed to it.

## Editors, because JSON is not a user interface

The first version stored everything in JSON files that I edited by hand. That's fine in July. It is not fine
at 7:40am when I want to add an event before first period.

So there's now a set of web editors for events, powers, and achievements. Add, edit, delete, disable, no
text editor involved. Powers moved out of hardcoded HTML into their own data file at the same time.

The remote also picked up the controls you only discover you need once you've run this live: undo the last
points award, veto an event, veto and reroll, or roll a specific event from a dropdown. There's a bridge
countdown timer at one, two, five, and ten minutes. There's a klaxon sound for event rolls, off by default,
because I'm not confident about every projector's speakers.

One fix that sounds trivial and wasn't: events are date-aware now. The old build would happily show
yesterday's event all morning until I rolled a new one, which undercuts the whole bit. If nothing has been
rolled today, the bridge says it's awaiting today's briefing.

## Where it runs

It's a Node app on a Proxmox container in my homelab, running as a systemd service, exposed through a
Cloudflare tunnel at valiantinquiry.com. Live data files are untracked in git with example templates
committed instead, so the repo doesn't contain my actual class rosters. There's a one-tap backup endpoint
that dumps all live data as JSON, which exists because I've lost data to my own server before and would
rather not explain that to a class.

Source is on my self-hosted Gitea.

## About the code

Same as last time: I designed this, specified it, and made the decisions about how it should work. Claude
wrote the code. I've gotten better at reading and directing it, and I understand this codebase well enough
to debug it and ask for the right changes, but I'd be misrepresenting things if I let you think I hand-wrote
a Node app with SSE and a pseudonymization layer. I didn't, and pretending otherwise would be silly on a
site where I also write about not knowing enough math yet.

What I did do is the part that determines whether any of it matters: knowing that student logins would kill
it, that table-versus-table would poison the room, that a random picker needs a memory, and that a roster of
real kids' names doesn't go to a vendor.

School starts in a few days. I'll find out how much of this survives contact with four actual classes.
