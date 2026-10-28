#!/usr/bin/env bash
# Usage: ./make_daily.sh <props.json> <mood: party|spooky|epic|chill> <seed> <out.mp4>
set -euo pipefail
cd "$(dirname "$0")"
PROPS="$1"; MOOD="$2"; SEED="$3"; OUT="$4"
TMP="$(mktemp -d)"
python3 audio/daily_music.py "$MOOD" "$SEED" "$TMP/m.wav" >/dev/null
ffmpeg -y -loglevel error -i "$TMP/m.wav" -af loudnorm=I=-14:TP=-1.0:LRA=11 -ar 48000 "$TMP/mn.wav"
CORES=$(nproc); [ "$CORES" -gt 4 ] && CORES=4
# Browser: Pfad aus remotion.config.ts, sonst die vorinstallierte Playwright-Headless-Shell
BROWSER_ARGS=()
if [ ! -x /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell ]; then
  HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | sort -V | tail -1 || true)
  [ -n "$HS" ] && BROWSER_ARGS=(--browser-executable="$HS")
fi
npx remotion render CrazyBuzzer-Daily-9x16 "$TMP/v.mp4" "${BROWSER_ARGS[@]}" --props="$PROPS" --concurrency="$CORES" --log=error
# Musik 0–11 s | Original-Sound des Logo-Stings (116 Frames = 3.867 s, auf ca. -14 LUFS angeglichen) | Musik 11–15 s
ffmpeg -y -loglevel error -i "$TMP/mn.wav" -i public/crazybuzzer/logo_sting.mp4 -filter_complex \
  "[0:a]atrim=0:11,asetpts=PTS-STARTPTS,afade=t=out:st=10.96:d=0.04[a];\
   [1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:3.8667,asetpts=PTS-STARTPTS,volume=0.6,afade=t=out:st=3.75:d=0.1167[s];\
   [0:a]atrim=start=11,asetpts=PTS-STARTPTS,afade=t=in:d=0.03[c];\
   [a][s][c]concat=n=3:v=0:a=1,alimiter=limit=0.89[o]" -map "[o]" -ar 48000 "$TMP/mix.wav"
ffmpeg -y -loglevel error -i "$TMP/v.mp4" -i "$TMP/mix.wav" -map 0:v -map 1:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"
rm -rf "$TMP"
