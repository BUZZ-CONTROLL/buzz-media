# CrazyBuzzer Daily-Reel

Template: `src/crazybuzzer/CrazyDaily.tsx` (Komposition `CrazyBuzzer-Daily-9x16`, 18,87 s, 1080×1920).

Ablauf: Hook 0–3 s · Slots 3–7 s · Message 7–11 s · **Logo-Sting 11–14,87 s** · CTA 14,87–18,87 s.
Der Logo-Sting ist die offizielle Fassung `public/crazybuzzer/logo_sting.mp4` (Final_A_9_16_Sound_Logo, mit Sound) –
nur diese Version verwenden. `make_daily.sh` legt seinen Original-Sound in die Musikpause.
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
