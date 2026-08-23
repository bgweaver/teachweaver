---
name: "A Monero Node"
category: "Hardware & Electronics"
icon: "fas fa-network-wired"
order: 4.5
image: ""
links: []
---
A full unpruned node running on a secondhand laptop, reachable over Tor as a hidden service so other people
can sync from it. Alongside it is a deliberately small miner on another scavenged laptop, doing about a
thousand hashes a second, which earns effectively nothing and is entirely the point. Both exist to add a
node and a little hash rate to a network I think should have more of both.

Getting the hidden service stable took longer than the node itself. A flaky guard relay caused circuits to
drop intermittently, which looked like a configuration problem for a while before it turned out to be
someone else's server having a bad week.
