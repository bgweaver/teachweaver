#!/usr/bin/env python3
"""
Make an 88x31 button locally.

    ./tools/make-button.py "MONERO" "accepted" --bg 1e1410 --fg ff8c3c --border ff6600
    ./tools/make-button.py "TEACH" "WEAVER" --out src/images/buttons/teachweaver.gif

Online button makers do their drawing in a browser canvas, which your
anti-fingerprinting setup corrupts. This does the same job offline.

Requires Pillow:  pip install --user pillow
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow not installed. Run:  pip install --user pillow")

FONT_DIRS = [
    "/usr/share/fonts/truetype/dejavu",
    "/usr/share/fonts/TTF",
    "/usr/share/fonts/dejavu",
]


def load_font(size, bold):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    for d in FONT_DIRS:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def hex_to_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise argparse.ArgumentTypeError(f"bad hex colour: {h}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def fit(draw, text, bold, start, max_w):
    """Shrink the font until the text fits inside max_w."""
    size = start
    while size > 5:
        f = load_font(size, bold)
        if draw.textbbox((0, 0), text, font=f)[2] <= max_w:
            return f
        size -= 1
    return load_font(5, bold)


def main():
    ap = argparse.ArgumentParser(description="Generate an 88x31 web button.")
    ap.add_argument("line1", help="top line (drawn bold)")
    ap.add_argument("line2", nargs="?", default="", help="bottom line")
    ap.add_argument("--bg", type=hex_to_rgb, default="14161c", help="background hex")
    ap.add_argument("--fg", type=hex_to_rgb, default="ffffff", help="text hex")
    ap.add_argument("--border", type=hex_to_rgb, default=None, help="border hex")
    ap.add_argument("--out", default=None, help="output path (.gif or .png)")
    args = ap.parse_args()

    border = args.border or args.fg
    im = Image.new("RGB", (88, 31), args.bg)
    d = ImageDraw.Draw(im)

    # classic double border: colour outside, black inside
    d.rectangle([0, 0, 87, 30], outline=border)
    d.rectangle([1, 1, 86, 29], outline=(0, 0, 0))

    if args.line2:
        rows = ((args.line1, True, 10, 5), (args.line2, False, 9, 17))
    else:
        rows = ((args.line1, True, 13, 9),)

    for text, bold, start, y in rows:
        f = fit(d, text, bold, start, 78)
        w = d.textbbox((0, 0), text, font=f)[2]
        d.text(((88 - w) // 2, y), text, font=f, fill=args.fg)

    out = args.out
    if not out:
        slug = args.line1.lower().replace(" ", "-")
        out = f"src/images/buttons/{slug}.gif"
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    im.save(out)
    print(f"wrote {out}")
    print(f'add to src/_data/badges.json:  {{ "image": "/images/buttons/{os.path.basename(out)}", '
          f'"alt": "{args.line1}", "url": "" }}')


if __name__ == "__main__":
    main()
