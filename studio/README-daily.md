# CrazyBuzzer Daily-Reel

Template: `src/crazybuzzer/CrazyDaily.tsx` (Komposition `CrazyBuzzer-Daily-9x16`, 15 s, 1080×1920).
Alle Tagesinhalte kommen aus einer Props-JSON (Felder siehe `DailyProps`).

```bash
cd studio
npm ci                      # einmalig
pip install numpy scipy     # falls nötig (Musik)
./make_daily.sh props.json party 42 ../crazybuzzer/2026-10-23-cb.mp4
```

Moods für die Musik: `party`, `spooky`, `epic`, `chill`. Seed = beliebige Zahl (andere Melodie).
Decor: `neon` (CI), `spooky`, `gold`, `winter`, `party`.
Spiele-Kacheln `tiles`: 0 Eye of Horus · 1 Lucky Pharaoh Wild · 2 Magic Mirror Deluxe · 3 Dragons Treasure · 4 El Torero · 5 Blazing Star · 6 Eye of Horus Power Spins · 7 Jolly's Cap
