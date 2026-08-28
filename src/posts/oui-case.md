---
title: "teachweaver: 3D-Printing Oui-Spy Case"
postTitle: "3D-Printing Oui-Spy Case"
date: 2026-08-28
postDate: "August 28, 2026"
description: "In which I design a case for a Oui-Spy device."
ogTitle: "3D-Printing Oui-Spy Case - teachweaver"
ogDescription: "In which I design a case for a Oui-Spy device."
ogImage: "https://www.teachweaver.com/images/oui-case.jpg"
ogUrl: "https://www.teachweaver.com/posts/oui-case/"
image: "/images/oui-case.jpg"
imageAlt: "A partially assembled 3D-printed case holding electronics."
listDescription: "Designing a case for a wardriving and bluetooth detection device."
---
![A red case opened up holding various electronics](/images/oui-case.jpg)

I love Colonel Panic's [Oui-Spy](https://github.com/colonelpanichacks/oui-spy). I had a spare ESP32-S3 and
wanted a case that could hang off my backpack and hold a charge. Mine doesn't look nearly as cool as Colonel
Panic's, but it was cheap, easy to print, and holds the parts plus a battery without needing a PCB. It
fulfilled all my design requirements. I'm also just proud to have designed something that functions for what
I need.

## Trial & Error
The first couple of redesigns were all about getting the lid and body to fit together. What I settled on was
four pegs on the body and four holes in the lid. If I were to redesign it, I'd play around with different
closures. Right now the pegs are fitted with super glue and called good, but that means I have to break it
to get back in. Inconvenient.

After that, I focused on getting space between the antenna and the battery. Originally I wanted it
perpendicular to the bottom and in its own shelf, but that made the body too wide. Since I was already
attaching the speaker to the lid, I made a shelf for the antenna there too, with a thin slit to peek out. I
don't love this, since it also limits taking the case apart.

When everything fit, I sealed it up. The battery was snug and nothing rattled around. Yay! Then I charged it
up and took it with me on errands to test it out. New problem unlocked. When the charge gets low, it gets
stuck in a brownout cycle and beeps constantly. It was not fun explaining to the doctor that yes, my pocket
is beeping, and no, I cannot make it stop, and I am very sorry.

When I got home, I cracked the case open and wired in a spare switch. It only needed a small modification to
let the switch stick out. Since then, it's worked wonderfully. The switch has to be on for it to charge, but
otherwise it hangs off my backpack and does its work. Paired with an app on my phone, it handles all my
wardriving and scanning needs. I still plan to rework some of the internals later, but in the meantime I'm
pretty pleased with this first attempt.

## Running
The original Oui-Spy required pairing with a Wi-Fi network to access logs. I prefer lukeswitz's fork,
[oui-spy-unified-blue](https://github.com/lukeswitz/oui-spy-unified-blue), which pairs to an Android app
instead. From the app I can scan for nearby Wi-Fi networks and Bluetooth devices, or turn on Flock camera
detection so the device and app alert me when one's nearby. It can also detect drones, Unitree robots, and
foxhunt other devices. I haven't explored the last three, but I've collected a fair bit of Wi-Fi and mapped
a fair number of Flock cameras. I'm pretty happy with the results.

## My Build 
1. [ESP32-S3](https://amazon.com/dp/B0DJ6NQFKX) - $9/unit in a pack of 3 ($27)
2. [3.7V 750mAh Rechargeable LiPo](https://amazon.com/dp/B0DZD9TJX5) - $16
3. [Power Switch](https://www.amazon.com/dp/B07FLWWX9G) - $4/switch in a pack of 2 ($8)
4. Speaker from an M5 Atom Voice - I'll have to find one comparable
5. 3D printer and PLA
6. Calipers, soldering iron, solder, heat gun, shrink tube

![Wiring diagram for an esp32-s3 to a speaker and lipo](/images/oui-diagram.jpg)

[Download the STL](/files/oui-case.stl)
