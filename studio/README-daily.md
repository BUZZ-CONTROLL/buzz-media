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

## Interaktive Reels (Quiz · Stopp · Duell · Bewerten)

Vorlage: `src/crazybuzzer/CrazyInteractive.tsx` (Komposition `CrazyBuzzer-Interactive-9x16`, gleiches Raster: Inhalt 0–11 s · Logo-Sting · CTA mit „Kommentiere unten!“).
Props: `InteractiveProps` (Feld `format` wählt die Variante). Fortschrittsbalken oben, Kommentar-Sprechblase am Ende.

```bash
COMP=CrazyBuzzer-Interactive-9x16 ./make_daily.sh props.json party 20261103 ../crazybuzzer/2026-11-03-cb-quiz.mp4
```

| format | Ablauf | tiles | Titelbild-Tipp |
|---|---|---|---|
| `quiz` | Hook 0–2,5 s · Frage + A–D + Countdown 5→1 (2,5–7,5 s, mit Tick-Sound) · Auflösung 7,5–11 s | 2 Kacheln zur Auflösung | 5,5 s (Frage + Antworten) |
| `stopp` | Hook · Slots rattern 2,5–8,5 s („antippen & halten“) · „Welchen hast du?“ | Reihenfolge des Durchlaufs (bis 8) | 2,2 s |
| `duell` | Hook 0–2 s · 3 Runden „Links oder rechts?“ je 2,5 s · „Deine Kombi?“ | 6 = 3 Paare | 3,5 s (Runde 1) |
| `bewerten` | Hook · Slot im Rampenlicht + Skala 1–10 · „Deine Note?“ | 1 | 5,5 s |

Quiz-Fragen nur mit eindeutig richtiger, allgemein bekannter Antwort (z. B. Länder, Tiere, Symbole aus den Slot-Themen) – keine Behauptungen über Spielmechanik, Gewinne oder Quoten.
