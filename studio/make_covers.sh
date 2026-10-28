#!/usr/bin/env bash
# Usage: ./make_covers.sh <video.mp4> <out-prefix>
# Schreibt <out-prefix>-cover-1.jpg (Titel), -cover-2.jpg (Slots), -cover-3.jpg (Logo/CTA)
# als 1080x1920-JPEGs. Zeiten passen zur Daily-Vorlage (Hook 0-3 s, Slots 3-7 s, Message 7-11 s,
# Logo-Sting 11-14,87 s -> Cover 3 bei 13,5 s = fertiges Logo, CTA 14,87-18,87 s).
set -euo pipefail
VIDEO="$1"; PREFIX="$2"
i=1
for t in 2.2 5.5 13.5; do
  ffmpeg -y -loglevel error -ss "$t" -i "$VIDEO" -frames:v 1 -vf "scale=1080:1920" -q:v 2 "$PREFIX-cover-$i.jpg"
  i=$((i+1))
done
ls -l "$PREFIX"-cover-*.jpg
