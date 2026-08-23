---
title: "teachweaver: Passingly Informed"
postTitle: "Passingly Informed"
date: 2026-06-26
postDate: "June 26, 2026"
description: "I don't follow sports at all, but people talk about them. So I built a daily Indianapolis digest that tells me just enough to hold up my end of a conversation."
ogTitle: "Passingly Informed - teachweaver"
ogDescription: "A daily Indianapolis sports digest for people who don't follow sports. Real data from ESPN, an LLM that only does phrasing, and a hard rule against inventing a score."
ogImage: "https://www.teachweaver.com/images/passing.jpg"
ogUrl: "https://www.teachweaver.com/posts/passingly-informed/"
image: "/images/passing.jpg"
imageAlt: "Passingly Informed"
listDescription: "I don't follow sports at all, but people talk about them. So I built a daily Indianapolis digest that tells me just enough to hold up my end of a conversation."
---

I do not follow sports. I could not tell you what season it currently is for most of them. This is a mild
social handicap in Indianapolis, where a meaningful percentage of small talk with coworkers, parents, and
people in line assumes a baseline familiarity with how the Pacers are doing.

The normal fix is to start following sports. I did not want to do that. I wanted a thing that would tell me,
each morning, roughly enough to nod along and ask a decent follow-up question. So I built one.

## What it actually gives you

It's a daily digest for Indianapolis teams, and the format matters more than the content. Each item is a
fact plus a way in. Not "the Pacers lost 112-105," but the result, followed by a question you could actually
ask a human being that hands the conversation back to them.

The best one, which I use constantly, is the escape hatch: some version of "I haven't kept up as much this
year, what'd I miss?" That reads as a busy person being polite rather than someone who has no idea what a
Pacer is. It gives the other person the floor, which is what they wanted anyway. Most people who bring up
sports are not looking for your analysis. They're looking for an opening.

## The rule the whole thing is built around

There's an LLM involved, and here's the part I'd defend: **the model never touches the facts.**

The data layer fetches real results from ESPN's free JSON endpoints. Scores, standings, records, game times,
all of it pulled and parsed before the model sees anything. The model's only job is phrasing. It gets handed
facts that are already true and turns them into sentences.

This isn't fussiness. If you let a model generate a sports digest freehand, it will produce something that
reads perfectly and contains a score that never happened. And the entire purpose of this tool is walking
into a conversation with a stranger and saying a thing out loud with confidence. A wrong score is worse than
no score, because no score is just ignorance and a wrong score is embarrassing in a way you won't discover
until it's too late.

So the prompt says, in about as many words, that inventing a result is a failure and silence is the correct
fallback. If the data isn't there, the item doesn't appear.

## The Indians problem

ESPN's free endpoints cover the majors and not much below. Which is fine for the Pacers, the Colts, and the
Fever, but the Indianapolis Indians are Triple-A, and Triple-A does not exist as far as ESPN's public API is
concerned.

MLB runs its own stats API that does cover the minors, so I bolted on a separate fetch path for it. I built
it as a fully isolated additive layer that produces the same fact shape as the ESPN teams, gated so any
failure just returns nothing. The Indians quietly disappear from the digest and the rest is untouched.

Getting the right team was its own small comedy. The first ID I tried turned out to be the Louisville Bats.

## Caching, or how this costs nothing

One generation per city per day, cached in SQLite. The cost unit is city-days, not users. Indianapolis-only
means exactly one real generation every morning no matter how many people read it.

The site itself is static, published to GitHub Pages. Single Python file, standard library only, no
dependencies to keep current. A scheduled job on my homelab kicks the build at 5am local, the digest
regenerates, and the page serves the cached copy all day.

I originally had a GitHub Actions cron as a backup trigger and then removed it. Two schedulers firing at the
same thing is not redundancy, it's two things to debug.

## Getting it to people

Added an RSS feed early since I read everything through my own reader anyway, and it's a handful of
functions writing a second file at build time.

Email was more annoying. I picked a newsletter service specifically for its RSS-to-email feature, then found
out that RSS-to-email and custom sending domains are both paywalled. So I wrote the sender myself instead:
pure standard library, fetches the day's digest, retries until it confirms it's actually got today's edition
rather than yesterday's, reads a subscriber list off my own container, and sends through a transactional
email API's free tier. If anything fails, my homelab notification bot yells at me about it.

That was more work than clicking a button on someone's dashboard, but it's about eighty lines and I own all
of it, and there is no plan I can get upgraded off of.

## Does it work

Yes, embarrassingly well. I've had multiple real conversations about the Fever that I was in no way
qualified to have. The trick isn't knowing sports. It's knowing one true recent fact and one good question,
which turns out to be the actual currency of small talk regardless of subject.

The code is mine in the sense that I designed it, specified the rules, and made the calls about how it
should behave. Claude wrote most of the actual Python. The part I'd claim is the rule that the model never
touches a fact, which is the difference between a tool and a liability.

Live at [passinglyinformed.com](https://www.passinglyinformed.com).
