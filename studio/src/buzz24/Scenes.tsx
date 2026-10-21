import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, FONT, Icon, Logo, RingMark, Stage, p, pop, rise, slideIn } from "./theme";

/* All key content between y=300 and y=1480 (Reels fullscreen + 4:5 feed + 3:4 grid safe). */
const L = 90;
const R = 90;

const H: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 96, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.0, letterSpacing: -1.5, color: C.white, textTransform: "uppercase", ...style }}>
    {children}
  </div>
);

/* 1 · HOOK (90 f) */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [0, 26], [-540, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const ring = pop(f, 0, 16);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
        <div style={{ scale: String(ring), filter: `drop-shadow(0 0 40px ${C.cyan}88)` }}>
          <RingMark size={520} rotate={spin} digits={p(f, 18, 10)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: L, right: R, top: 900, textAlign: "center" }}>
        <H size={100} style={rise(f, 26, 12, 60)}>
          Training,
          <br />
          wann <span style={{ color: C.cyan }}>du</span> willst.
        </H>
        <div style={{ marginTop: 34, fontSize: 40, fontWeight: 700, color: C.muted, letterSpacing: 1, ...rise(f, 40, 12, 30) }}>
          24 Stunden · 7 Tage · 365 Tage im Jahr
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 2 · ACCESS (120 f) — phone flow: app → membership → QR scan → turnstile open */
const QR: React.FC<{ size: number; scan: number }> = ({ size, scan }) => {
  const n = 21;
  const cell = size / n;
  const finder = (x: number, y: number) =>
    x < 7 && y < 7 ? true : x >= n - 7 && y < 7 ? true : x < 7 && y >= n - 7;
  return (
    <div style={{ position: "relative", width: size, height: size, background: "#fff", borderRadius: 16, padding: 0 }}>
      <svg width={size} height={size}>
        {new Array(n * n).fill(0).map((_, k) => {
          const x = k % n;
          const y = Math.floor(k / n);
          if (finder(x, y)) return null;
          return random(`qr${k}`) > 0.52 ? <rect key={k} x={x * cell} y={y * cell} width={cell} height={cell} fill={C.black} /> : null;
        })}
        {[
          [0, 0],
          [n - 7, 0],
          [0, n - 7],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} fill={C.black} />
            <rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} fill="#fff" />
            <rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} fill={C.black} />
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: -10,
          right: -10,
          top: `${scan * 100}%`,
          height: 6,
          background: C.cyan,
          boxShadow: `0 0 24px 6px ${C.cyan}`,
          opacity: scan > 0 && scan < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};

const STEPS2 = ["BUZZ24-App laden", "Mitgliedschaft im Webshop wählen", "QR-Code scannen – fertig!"];

export const S2Access: React.FC = () => {
  const f = useCurrentFrame();
  const st = [8, 38, 68];
  const active = f >= st[2] ? 2 : f >= st[1] ? 1 : 0;
  const scan = interpolate(f, [72, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const open = p(f, 92, 14);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: L, right: R, top: 310 }}>
        <H size={74} style={rise(f, 0, 10, 40)}>
          So einfach
          <br />
          <span style={{ color: C.cyan }}>kommst du rein</span>
        </H>
      </div>
      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 520,
          width: 400,
          height: 760,
          borderRadius: 56,
          background: "linear-gradient(160deg, #1d2a44, #0d1322)",
          border: `3px solid ${C.line}`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 10px #05070c`,
          overflow: "hidden",
          ...rise(f, 2, 14, 80),
        }}
      >
        <div style={{ position: "absolute", top: 18, left: 150, width: 100, height: 26, borderRadius: 13, background: "#05070c" }} />
        {/* screen 1: app */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: active === 0 ? 1 : 0 }}>
          <div style={{ scale: String(pop(f, st[0], 12)) }}>
            <div style={{ width: 200, height: 200, borderRadius: 46, background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RingMark size={160} rotate={f * 4} ringColor={C.white} />
            </div>
          </div>
          <div style={{ marginTop: 30, fontSize: 36, fontWeight: 800, color: C.white }}>BUZZ24</div>
          <div style={{ marginTop: 22, width: 220, height: 12, borderRadius: 6, background: C.line, overflow: "hidden" }}>
            <div style={{ width: `${p(f, st[0] + 6, 22) * 100}%`, height: "100%", background: C.cyan }} />
          </div>
        </div>
        {/* screen 2: membership */}
        <div style={{ position: "absolute", inset: 0, padding: "90px 34px", opacity: active === 1 ? 1 : 0 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.white }}>Webshop</div>
          {["Probetag", "Mitgliedschaft"].map((t, i) => (
            <div
              key={t}
              style={{
                marginTop: 24,
                padding: "26px 24px",
                borderRadius: 20,
                background: i === 1 ? `${C.cyan}22` : C.card,
                border: `2px solid ${i === 1 ? C.cyan : C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                ...rise(f, st[1] + 2 + i * 5, 10, 30),
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: C.white }}>{t}</div>
              {i === 1 ? (
                <div style={{ scale: String(pop(f, st[1] + 16, 10)) }}>
                  <Icon name="check" size={44} />
                </div>
              ) : null}
            </div>
          ))}
          <div
            style={{
              marginTop: 40,
              padding: "20px 0",
              borderRadius: 999,
              background: C.cyan,
              color: C.black,
              textAlign: "center",
              fontSize: 28,
              fontWeight: 900,
              scale: String(pop(f, st[1] + 18, 10)),
            }}
          >
            KAUFEN
          </div>
        </div>
        {/* screen 3: QR */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: active === 2 ? 1 : 0 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 30 }}>Dein Zutritt</div>
          <div style={{ scale: String(pop(f, st[2], 10)) }}>
            <QR size={290} scan={scan} />
          </div>
          <div
            style={{
              marginTop: 34,
              padding: "14px 30px",
              borderRadius: 999,
              background: C.cyan,
              color: C.black,
              fontSize: 28,
              fontWeight: 900,
              opacity: open,
              scale: String(pop(f, 92, 10)),
            }}
          >
            ZUTRITT FREI
          </div>
        </div>
      </div>
      {/* steps */}
      <div style={{ position: "absolute", left: 540, right: R, top: 600, display: "flex", flexDirection: "column", gap: 34 }}>
        {STEPS2.map((t, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <div key={t} style={{ display: "flex", gap: 22, alignItems: "flex-start", ...slideIn(f, st[i] - 4, 12, 120) }}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: on ? C.cyan : "transparent",
                  border: `3px solid ${on || done ? C.cyan : C.line}`,
                  color: on ? C.black : C.cyan,
                  fontSize: 36,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: on ? `0 0 30px ${C.cyan}88` : "none",
                }}
              >
                {done ? <Icon name="check" size={40} /> : i + 1}
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.12, color: on ? C.white : C.faint, paddingTop: 6 }}>{t}</div>
            </div>
          );
        })}
      </div>
      {/* turnstile flash line */}
      <div
        style={{
          position: "absolute",
          left: L,
          right: R,
          top: 1360,
          fontSize: 34,
          fontWeight: 700,
          color: C.muted,
          textAlign: "center",
          ...rise(f, 96, 12, 20),
        }}
      >
        Kein Schlüssel, keine Karte – nur dein Handy.
      </div>
    </AbsoluteFill>
  );
};

/* 3 · HYGIENE (150 f) */
const HYG = [
  { icon: "sparkle", t: "3× täglich Profireinigung", s: "Morgens · Mittags · Abends" },
  { icon: "snow", t: "Klimaanlage & Fußbodenheizung", s: "Angenehm – Sommer wie Winter" },
  { icon: "wind", t: "Moderne Lüftung", s: "Frische Luft, frischer Duft" },
  { icon: "shower", t: "Private Umkleiden & Duschen", s: "Mit absperrbaren Spinden" },
];
export const S3Hygiene: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: L, right: R, top: 310 }}>
        <H size={104} style={rise(f, 0, 10, 50)}>
          Hotel-
          <br />
          Standard.
        </H>
        <H size={104} style={{ color: C.cyan, ...rise(f, 6, 10, 50) }}>
          Jeden Tag.
        </H>
      </div>
      <div style={{ position: "absolute", left: L, right: R, top: 700, display: "flex", flexDirection: "column", gap: 22 }}>
        {HYG.map((h, i) => {
          const s = 18 + i * 15;
          return (
            <div
              key={h.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "26px 30px",
                borderRadius: 24,
                background: i === 0 ? `${C.cyan}1c` : C.card,
                border: `2px solid ${i === 0 ? C.cyan : C.line}`,
                ...slideIn(f, s, 12, -160),
              }}
            >
              <div style={{ scale: String(pop(f, s + 4, 10)) }}>
                <Icon name={h.icon} size={68} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1.1 }}>{h.t}</div>
                <div style={{ marginTop: 6, fontSize: 28, fontWeight: 500, color: C.muted }}>{h.s}</div>
              </div>
              <div style={{ scale: String(pop(f, s + 8, 10)) }}>
                <Icon name="check" size={46} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 4 · EQUIPMENT (150 f) */
const EQ = [
  { icon: "dumbbell", t: "Freihantel & Power Rack" },
  { icon: "machine", t: "Kraftgeräte" },
  { icon: "run", t: "Cardio & Stair Climber" },
  { icon: "kettlebell", t: "Functional-Area" },
  { icon: "lounge", t: "Lounge & Ladestation" },
];
export const S4Equipment: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: L, right: R, top: 310 }}>
        <H size={96} style={rise(f, 0, 10, 50)}>
          Brandneue
          <br />
          <span style={{ color: C.cyan }}>Geräte.</span>
        </H>
        <div style={{ marginTop: 20, fontSize: 40, fontWeight: 700, color: C.muted, ...rise(f, 8, 10, 30) }}>Durchdachte Raumaufteilung.</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: L,
          right: R,
          top: 660,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 22,
        }}
      >
        {EQ.map((e, i) => {
          const s = 16 + i * 9;
          const t = pop(f, s, 14);
          const wide = i === EQ.length - 1;
          return (
            <div
              key={e.t}
              style={{
                gridColumn: wide ? "1 / span 2" : undefined,
                height: wide ? 150 : 230,
                padding: "30px 30px",
                borderRadius: 26,
                background: C.card,
                border: `2px solid ${C.line}`,
                display: "flex",
                flexDirection: wide ? "row" : "column",
                alignItems: wide ? "center" : "flex-start",
                gap: wide ? 28 : 0,
                opacity: Math.min(1, t * 1.4),
                scale: String(interpolate(t, [0, 1], [0.7, 1])),
              }}
            >
              <Icon name={e.icon} size={wide ? 72 : 84} />
              <div style={{ marginTop: wide ? 0 : "auto", fontSize: 38, fontWeight: 800, color: C.white, lineHeight: 1.1 }}>{e.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 5 · COACH (120 f) */
export const S5Coach: React.FC = () => {
  const f = useCurrentFrame();
  const cards = [
    { t: "Personal Training", s: "50 Min. inkl. Trainingsplan", price: "75 €" },
    { t: "Geräteeinweisung", s: "30 Min. – ideal für den Start", price: "30 €" },
  ];
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: L, right: R, top: 310 }}>
        <H size={88} style={rise(f, 0, 10, 50)}>
          Allein trainieren –
        </H>
        <H size={88} style={{ color: C.cyan, marginTop: 8, ...rise(f, 8, 10, 50) }}>
          oder mit Coach.
        </H>
      </div>
      <div style={{ position: "absolute", left: L, right: R, top: 620, display: "flex", flexDirection: "column", gap: 26 }}>
        {cards.map((c, i) => (
          <div
            key={c.t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              padding: "36px 36px",
              borderRadius: 28,
              background: i === 0 ? `${C.cyan}1c` : C.card,
              border: `2px solid ${i === 0 ? C.cyan : C.line}`,
              ...slideIn(f, 18 + i * 12, 12, 160),
            }}
          >
            <Icon name={i === 0 ? "coach" : "machine"} size={76} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.white }}>{c.t}</div>
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 500, color: C.muted }}>{c.s}</div>
            </div>
            <div style={{ fontSize: 50, fontWeight: 900, color: C.cyan }}>{c.price}</div>
          </div>
        ))}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "26px 32px",
            borderRadius: 24,
            border: `2px dashed ${C.line}`,
            ...rise(f, 46, 12, 30),
          }}
        >
          <Icon name="clock" size={58} />
          <div style={{ fontSize: 32, fontWeight: 700, color: C.white, lineHeight: 1.25 }}>
            Persönliche Betreuung vor Ort
            <div style={{ color: C.cyan }}>Mo–Mi · 14–17 Uhr</div>
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: C.muted, textAlign: "center", ...rise(f, 56, 12, 20) }}>
          Und jederzeit per WhatsApp, Telefon & E-Mail.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 6 · PRICES (150 f) */
const Price: React.FC<{ value: number; start: number; size: number }> = ({ value, start, size }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [start, start + 22], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) }));
  return <span style={{ fontSize: size, fontWeight: 900, color: C.white, lineHeight: 1 }}>{v}</span>;
};
export const S6Prices: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <div style={{ position: "absolute", left: L, right: R, top: 310 }}>
        <H size={92} style={rise(f, 0, 10, 50)}>
          Keine
          <br />
          <span style={{ color: C.cyan }}>Anmeldegebühr.</span>
        </H>
      </div>
      <div style={{ position: "absolute", left: L, right: R, top: 600, display: "flex", flexDirection: "column", gap: 30 }}>
        {/* trial day */}
        <div
          style={{
            padding: "40px 44px",
            borderRadius: 32,
            background: C.card,
            border: `2px solid ${C.line}`,
            ...slideIn(f, 12, 12, -160),
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: C.cyan, letterSpacing: 2 }}>PROBETAG</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
            <Price value={12} start={16} size={150} />
            <span style={{ fontSize: 64, fontWeight: 900, color: C.white }}>€</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 600, color: C.muted }}>24 h gültig · ohne Bindung</div>
        </div>
        {/* membership */}
        <div
          style={{
            position: "relative",
            padding: "40px 44px",
            borderRadius: 32,
            background: `linear-gradient(140deg, ${C.cyan}33, ${C.indigo}55)`,
            border: `3px solid ${C.cyan}`,
            boxShadow: `0 0 60px ${C.cyan}44`,
            ...slideIn(f, 30, 12, 160),
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: C.cyan, letterSpacing: 2 }}>MITGLIEDSCHAFT</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
            <span style={{ fontSize: 56, fontWeight: 800, color: C.white }}>ab</span>
            <Price value={39} start={34} size={150} />
            <span style={{ fontSize: 64, fontWeight: 900, color: C.white }}>€</span>
            <span style={{ fontSize: 40, fontWeight: 700, color: C.muted }}>/ Monat*</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 32, fontWeight: 600, color: C.muted }}>Wähl deinen Weg – flexibel bis 24/7</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: L,
          right: R,
          top: 1400,
          fontSize: 24,
          fontWeight: 500,
          color: C.faint,
          textAlign: "center",
          ...rise(f, 44, 10, 10),
        }}
      >
        *Tag-Abo: Zutritt 10–16 Uhr, 12 Monate Laufzeit. Weitere Tarife auf buzz24.fitness
      </div>
    </AbsoluteFill>
  );
};

/* 7 · CTA (120 f) */
export const S7Cta: React.FC = () => {
  const f = useCurrentFrame();
  const ringRot = interpolate(f, [0, 30], [-360, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const pulse = 1 + Math.max(0, Math.sin(((f - 30) / 15) * Math.PI * 2)) * 0.035;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Stage />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, paddingLeft: L, paddingRight: R, textAlign: "center" }}>
        <div style={{ scale: String(interpolate(p(f, 0, 14), [0, 1], [0.85, 1])), opacity: p(f, 0, 8) }}>
          <Logo width={880} ringRotate={ringRot} wordReveal={p(f, 10, 18)} digitsOpacity={p(f, 22, 8)} />
        </div>
        <H size={84} style={{ marginTop: 70, ...rise(f, 26, 12, 40) }}>
          Heute noch
          <br />
          <span style={{ color: C.cyan }}>trainieren.</span>
        </H>
        <div
          style={{
            marginTop: 50,
            padding: "30px 64px",
            borderRadius: 999,
            background: C.cyan,
            color: C.black,
            fontSize: 46,
            fontWeight: 900,
            boxShadow: `0 0 60px ${C.cyan}77`,
            scale: String(pop(f, 36, 12) * pulse),
          }}
        >
          Probetag für 12 €
        </div>
        <div style={{ marginTop: 40, fontSize: 44, fontWeight: 900, color: C.white, ...rise(f, 46, 10, 20) }}>buzz24.fitness</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 600, color: C.muted, ...rise(f, 52, 10, 20) }}>
          <Icon name="pin" size={40} /> Gartengasse 2 · Wiener Neudorf
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 30, fontWeight: 600, color: C.muted, ...rise(f, 58, 10, 20) }}>
          <Icon name="star" size={32} color={C.cyan} /> 4,9 bei Google · <Icon name="car" size={36} /> Tiefgarage im Haus
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
