#!/bin/sh
# Resize, compress, and strip metadata from images for the site.
#
#   ./tools/optimize.sh ~/Pictures/clock.jpg
#   ./tools/optimize.sh ~/Pictures/*.jpg
#
# Writes results into src/images/ with the same base name.
# Requires ImageMagick (apt: imagemagick / xbps: ImageMagick / pacman: imagemagick)
#
# WIDTH  - max width in pixels (default 1200; nothing on the site displays wider)
# FORMAT - jpg or avif (default jpg; avif is smaller but slower to encode)
# QUALITY- override the default quality for the chosen format

WIDTH="${WIDTH:-1200}"
FORMAT="${FORMAT:-jpg}"
OUTDIR="${OUTDIR:-src/images}"

if [ "$FORMAT" = "avif" ]; then
  QUALITY="${QUALITY:-55}"
else
  QUALITY="${QUALITY:-82}"
fi

# ImageMagick 7 uses "magick"; version 6 uses "convert"/"identify".
if command -v magick >/dev/null 2>&1; then
  IM="magick"; IMID="magick identify"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"; IMID="identify"
else
  echo "ImageMagick not found. Install it with:" >&2
  if command -v apt >/dev/null 2>&1; then
    echo "  sudo apt install imagemagick" >&2
  elif command -v xbps-install >/dev/null 2>&1; then
    echo "  sudo xbps-install -S ImageMagick" >&2
  elif command -v pacman >/dev/null 2>&1; then
    echo "  sudo pacman -S imagemagick" >&2
  elif command -v dnf >/dev/null 2>&1; then
    echo "  sudo dnf install ImageMagick" >&2
  else
    echo "  (your package manager's imagemagick package)" >&2
  fi
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "usage: $0 <image> [image...]" >&2
  exit 1
fi

mkdir -p "$OUTDIR"

for src in "$@"; do
  [ -f "$src" ] || { echo "skip (not a file): $src" >&2; continue; }

  base=$(basename "$src")
  stem=${base%.*}
  # lowercase, spaces and underscores to dashes
  slug=$(printf '%s' "$stem" | tr '[:upper:]' '[:lower:]' | tr ' _' '--')
  out="$OUTDIR/$slug.$FORMAT"

  # -strip removes EXIF, including GPS coordinates from phone photos.
  # ">" in the resize means "only shrink, never upscale".
  $IM "$src" -auto-orient -resize "${WIDTH}x>" -quality "$QUALITY" -strip "$out" || {
    echo "FAILED: $src" >&2
    continue
  }

  before=$(du -h "$src" | cut -f1)
  after=$(du -h "$out" | cut -f1)
  printf '%s  %s -> %s  (%s)\n' "$slug.$FORMAT" "$before" "$after" "$($IMID -format '%wx%h' "$out")"
done

echo
echo "Done. Reference these in frontmatter as:  image: \"/images/NAME.$FORMAT\""
