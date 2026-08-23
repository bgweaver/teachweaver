---
name: "Iris, the House Voice Assistant"
category: "Hardware & Electronics"
icon: "fas fa-microphone"
order: 3.5
image: ""
links: []
---
A voice assistant for the house that answers to "Hey Iris" and doesn't talk to Amazon or Google. Speech
recognition and speech synthesis both run on my own server, so a command spoken in the kitchen never leaves
the building. The satellites are a mix of purpose-built hardware, ESP32 boards I flashed myself, and one
repurposed Echo Show running LineageOS, which is a satisfying end for that device.

The wake word was the hard part. Off-the-shelf models either fired at the TV constantly or missed my wife
entirely, so I ended up training a custom one, which took several rounds and taught me more about false
accept rates than I expected to know. Getting response time down meant moving speech recognition off the
Home Assistant VM onto its own container. Choosing the synthesized voice was a family vote.
