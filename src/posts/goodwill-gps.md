---
title: "teachweaver: Goodwill GPS"
postTitle: "Goodwill GPS"
date: 2026-08-30
postDate: "August 30, 2026"
description: "In which I put OpenStreetMap on a thrift store GPS and remember that devices used to just do one thing."
ogTitle: "Goodwill GPS - teachweaver"
ogDescription: "In which I put OpenStreetMap on a thrift store GPS and remember that devices used to just do one thing."
ogUrl: "https://www.teachweaver.com/posts/goodwill-gps/"
ogImage: "https://www.teachweaver.com/images/gps.jpg"
image: "/images/gps.jpg"
imageAlt: "The main menu of a Garmin nuvi."
listDescription: "I bought three GPS units in a box at Goodwill for about three dollars each. One of them is now the only thing in my car that knows where I am."
---

I bought three GPS units in a box at Goodwill. A TomTom XL and two Garmin nuvis, about three dollars each. I did not need a GPS. I have a phone like everybody else. What I wanted was a map in the car that isn't also a tracking device, and I figured a fifteen year old GPS was the closest thing to that I was going to find.

I spent the first two days on the TomTom, because there's a project called OpenTom that rips out the stock firmware and puts a real Linux distribution on it, and that sounded like a lot more fun than copying a file onto a Garmin. It does work. The toolchain it wants is from 2006 and most of those two days went into fixing twenty year old build scripts against a current Debian, which is its own kind of good time. At the end of it the thing boots into Navit with an OpenStreetMap map of Indiana and navigates. I'm not using it. The touchscreen is a worn out resistive panel that I recalibrated three times and still can't hit accurately, and drawing a state-sized map on that processor means the screen sits black for a while after every boot. Great project. Bad object.

So I plugged in the Garmin, which I had been ignoring, and it turned out to already do everything I actually wanted.

Only the nuvi 500, 800, and 900 series ever ran Linux. Everything else runs Garmin's own operating system and as far as I can tell nobody has ever cracked it, so there's no custom firmware for these and there isn't going to be. That stopped mattering pretty quickly once I read what the stock firmware already supports, which is basically all of it.

You can put your own maps on it. There are free OpenStreetMap builds by region, they come as `.img` files, and they go in a folder called `Map` on the device or on an SD card. I put the whole Midwest on a 4GB microSD I had in a drawer. Then in Settings, Map, Info, there's a list of installed maps with checkboxes. Uncheck the Garmin one so it doesn't try to route off both at the same time. That's it. That's the hack.

The unit has no WiFi, no Bluetooth, and no cell radio in it at all. It can't phone home because there's nothing in it to phone home with. I spent two days building that same guarantee into the TomTom and this thing came with it for free.

The other thing the Garmin does, which is the part I actually built this for, is custom POI files with proximity alerts. That's the mechanism behind the speed camera warnings Garmin sells, and it's wide open. You can put any points you want in it and it will beep at you when you get near them.

Which means I can load it up with Flock cameras.

DeFlock doesn't keep the ALPR locations in a private database. Everything volunteers report goes into OpenStreetMap, tagged `man_made=surveillance` and `surveillance:type=ALPR`, so anybody can pull the same data with no account and no key. For the whole state:

```bash
curl -s -X POST https://overpass-api.de/api/interpreter --data-urlencode 'data=
[out:json][timeout:120];
area["admin_level"="4"]["name"="Indiana"]->.a;
node["man_made"="surveillance"]["surveillance:type"="ALPR"](area.a);
out body;
' > alpr.json
```

That gave me 3,696 cameras. Then convert it to the CSV gpsbabel expects:

```python
import json
d = json.load(open('alpr.json'))
print('lat,lon,name')
for i, e in enumerate(d['elements'], 1):
    t = e.get('tags', {})
    mfr = t.get('manufacturer', 'ALPR')
    print('%s,%s,%s %d' % (e['lat'], e['lon'], mfr, i))
```

Make yourself a 24x24 BMP for the icon, then build the file:

```bash
convert icon.png -resize 24x24 -background white -flatten -type truecolor BMP3:alpr24.bmp

gpsbabel -i unicsv -f alpr.csv \
  -o garmin_gpi,category="ALPR",proximity=0.25M,alerts=1,bitmap=alpr24.bmp \
  -F ALPR.gpi
```

Drop the `.gpi` in the `POI` folder on the device. The cameras show up on the map with your icon and it warns you a quarter mile out.

If you don't feel like drawing one, [here's the BMP I used](/files/alpr24.bmp).

The data is only as good as what people have mapped, so this tells you where the known readers are and not where all of them are. Still. Three dollars.

The thing I didn't expect to get out of this was how much I liked using a device that only does one thing.

I keep coming back to that. A GPS from 2011 turns on and shows you a map. That's the whole deal. It doesn't have an account. It doesn't want my email address. It won't stop working in four years because somebody shut down a server, and nobody is going to push an update that removes a feature I use or adds a subscription to a thing I already paid for. It doesn't know anything about me except where I am right now, and it isn't telling anybody, because it can't.

None of that was a design goal. It's just what devices were before location data turned out to be worth more than the hardware. You get all of it for free at a thrift store and it costs you a small screen and a slow processor, which is a trade I'd take most days.

A note on how this got done: I worked through all of it with Claude. The Overpass query, the conversion script, and the gpsbabel command above are its code. The two days on the TomTom were mostly me pasting build errors and Claude reading source to work out what was wrong. I made the calls about what to try, ran everything, and checked the camera data against what DeFlock shows for my county.

I'm disclosing that because it's true, not because I feel bad about it. This is a GPS in my car with no network connection. Nobody else uses it and nothing I did to it can hurt anyone. That's exactly the kind of project where working with an LLM is a good deal: I got to build something out of hardware and tooling I couldn't have gotten through on my own yet, and I learned a fair amount on the way.
