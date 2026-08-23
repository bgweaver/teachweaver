---
name: "Passingly Informed"
category: "Software & Web"
icon: "fas fa-newspaper"
order: 7.5
image: "/images/passing.jpg"
imageAlt: "Passingly Informed"
links:
  - label: "Live site"
    url: "https://www.passinglyinformed.com"
  - label: "Read the post"
    url: "/posts/passingly-informed/"
---
A daily Indianapolis sports digest for people who don't follow sports but still have to talk to people who
do. Each item is a real result plus a question you could actually ask someone. The data comes from ESPN's
free endpoints and MLB's own API for the Triple-A team ESPN ignores; an LLM handles phrasing only and is
never allowed near a fact, because a confidently wrong score is worse than saying nothing. Single Python
file, standard library only, cached one generation per day, published as a static site. There's an RSS feed
and an email sender I wrote after the newsletter service paywalled the feature I wanted.
