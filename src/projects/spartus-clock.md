---
name: "Spartus Clock Rebuild"
category: "Hardware & Electronics"
icon: "fas fa-clock"
order: 1
image: "/images/clock.jpg"
imageAlt: "The restored Spartus clock"
gallery:
  - src: "/images/clock-scattered.jpg"
    alt: "The original clock movement, disassembled"
links: []
---
A vintage Spartus grandfather clock whose original movement was beyond saving. I photographed the teardown,
then rebuilt the whole thing around a XIAO ESP32-S3 and a MAX98357A amp running ESPHome. The Westminster
chimes and hourly strike are synthesized in Python rather than sampled, and it pulls time over SNTP so it
never drifts. It sat gutted on a shelf for about a year before I picked it back up and finished it.
