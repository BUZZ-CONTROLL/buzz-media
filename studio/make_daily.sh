#!/usr/bin/env bash
# Usage: ./make_daily.sh <props.json> <mood: party|spooky|epic|chill> <seed> <out.mp4>
set -euo pipefail
cd "$(dirname "$0")"
PROPS="$1"; MOOD="$2"; SEED="$3"; OUT="$4"
TMP="$(mktemp -d)"
python3 audio/daily_music.py "$MOOD" "$SEED" "$TMP/m.wav" >/dev/null
ffmpeg -y -loglevel error -i "$TMP/m.wav" -af loudnorm=I=-14:TP=-1.0:LRA=11 -ar 48000 "$TMP/mn.wav"
CORES=$(nproc); [ "$CORES" -gt 4 ] && CORES=4
npx remotion render CrazyBuzzer-Daily-9x16 "$TMP/v.mp4" --props="$PROPS" --concurrency="$CORES" --log=error
ffmpeg -y -loglevel error -i "$TMP/v.mp4" -i "$TMP/mn.wav" -map 0:v -map 1:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"
rm -rf "$TMP"
