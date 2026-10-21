import React from "react";
import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, C, Eyebrow, FONT, Icon, p, reveal } from "./theme";

const START = 18;
const LEN = 76;

const STEPS = [
  { n: "01", title: "Erstgespräch", sub: "Kostenlos & unverbindlich" },
  { n: "02", title: "Bodyscan & Analyse", sub: "Dein genauer Ausgangspunkt" },
  { n: "03", title: "Dein Trainingsplan", sub: "Maßgeschneidert auf Ziel & Alltag" },
  { n: "04", title: "Training & Tracking", sub: "Fortschritt, der sichtbar wird" },
];

const Panel: React.FC<{ i: number; children: React.ReactNode }> = ({ i, children }) => {
  const f = useCurrentFrame();
  const s = START + i * LEN;
  const inP = p(f, s, 20);
  const outP = i === STEPS.length - 1 ? 0 : p(f, s + LEN - 8, 12);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: 56,
        opacity: inP * (1 - outP),
        translate: `${interpolate(inP, [0, 1], [60, 0]) - outP * 40}px 0px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
};

const Ring: React.FC<{ label: string; value: number; color: string; delay: number }> = ({
  label,
  value,
  color,
  delay,
}) => {
  const f = useCurrentFrame();
  const t = p(f, delay, 36) * value;
  const r = 84;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={r} stroke={C.line} strokeWidth="12" fill="none" />
        <circle
          cx="100"
          cy="100"
          r={r}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - t)}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div style={{ fontSize: 30, fontWeight: 700, color: C.paper }}>{label}</div>
    </div>
  );
};

export const StepsScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const f = useCurrentFrame();
  const active = Math.min(
    STEPS.length - 1,
    Math.max(0, Math.floor((f - START) / LEN)),
  );
  const panelIn = p(f, 6, 24);

  // chart for step 4
  const s4 = START + 3 * LEN;
  const draw = p(f, s4 + 10, 50);
  const pts = [
    [0, 300], [110, 270], [220, 280], [330, 220], [440, 190], [550, 150], [660, 110], [740, 60],
  ];
  const pathD = pts.map((q, k) => `${k ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Backdrop />
      <Interactive.Div
        name="Steps eyebrow"
        style={{ position: "absolute", left: vertical ? 90 : 200, top: vertical ? 305 : 120, ...reveal(f, 0, 20, 20) }}
      >
        <Eyebrow>Dein Weg zum Ziel</Eyebrow>
      </Interactive.Div>

      {/* Step list */}
      <div style={{ position: "absolute", left: vertical ? 90 : 200, top: vertical ? 355 : 230, width: vertical ? 900 : 640 }}>
        {STEPS.map((s, i) => {
          const on = i === active;
          const done = i < active;
          const ap = p(f, START + i * LEN, 14);
          return (
            <div
              key={s.n}
              style={{
                position: "relative",
                display: "flex",
                gap: 34,
                padding: vertical ? "12px 0" : "26px 0",
                alignItems: vertical ? "center" : undefined,
                ...reveal(f, 4 + i * 5, 22, 30),
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 800,
                  color: on ? C.ink : done ? C.cyan : C.faint,
                  backgroundColor: on ? C.cyan : "transparent",
                  border: `2.5px solid ${on || done ? C.cyan : C.line}`,
                  boxShadow: on ? `0 0 40px ${C.cyan}77` : "none",
                  scale: String(on ? interpolate(ap, [0, 1], [0.85, 1]) : 1),
                }}
              >
                {s.n}
              </div>
              <div>
                <div
                  style={{
                    fontSize: vertical ? 42 : 46,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: on ? C.paper : C.faint,
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    marginTop: vertical ? 2 : 6,
                    fontSize: vertical ? 27 : 30,
                    fontWeight: 400,
                    color: on ? C.muted : "rgba(251,251,249,0.22)",
                  }}
                >
                  {s.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual panel */}
      <div
        style={{
          position: "absolute",
          left: vertical ? 90 : 900,
          right: vertical ? 90 : 200,
          top: vertical ? 800 : 220,
          height: vertical ? 650 : 640,
          borderRadius: 36,
          backgroundColor: "rgba(22,26,68,0.55)",
          border: `1.5px solid ${C.line}`,
          overflow: "hidden",
          opacity: panelIn,
          translate: `0px ${interpolate(panelIn, [0, 1], [50, 0])}px`,
        }}
      >
        {/* 1 Erstgespräch */}
        <Panel i={0}>
          <Icon name="calendar" size={110} />
          <div style={{ marginTop: 40, fontSize: 64, fontWeight: 800, color: C.paper, lineHeight: 1.05 }}>
            Wir lernen dich
            <br />
            kennen.
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: C.muted, lineHeight: 1.4 }}>
            Ziele klären, Fragen beantworten –
            <br />
            in Ruhe und persönlich.
          </div>
          <div
            style={{
              marginTop: "auto",
              alignSelf: "flex-start",
              padding: "16px 30px",
              borderRadius: 999,
              border: `2px solid ${C.cyan}`,
              color: C.cyan,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            KOSTENLOS · UNVERBINDLICH
          </div>
        </Panel>

        {/* 2 Bodyscan */}
        <Panel i={1}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Icon name="scan" size={80} />
            <div style={{ fontSize: 52, fontWeight: 800, color: C.paper }}>Bodyscan</div>
          </div>
          <div style={{ marginTop: 18, fontSize: 32, color: C.muted }}>
            Präzise Körperanalyse als Startpunkt
          </div>
          <div
            style={{
              marginTop: "auto",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Ring label="Muskelmasse" value={0.78} color={C.cyan} delay={START + LEN + 12} />
            <Ring label="Körperfett" value={0.42} color={C.sky} delay={START + LEN + 18} />
            <Ring label="Wasserhaushalt" value={0.64} color={C.paper} delay={START + LEN + 24} />
          </div>
        </Panel>

        {/* 3 Trainingsplan */}
        <Panel i={2}>
          <div style={{ fontSize: 52, fontWeight: 800, color: C.paper }}>Dein Plan</div>
          <div style={{ marginTop: 12, fontSize: 32, color: C.muted }}>
            Abgestimmt auf Ziel, Zeit und Niveau
          </div>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              ["MO", "Kraft · gelenkschonend", "07:00"],
              ["MI", "Mobility & Pilates", "12:30"],
              ["FR", "Ausdauer & Functional", "18:00"],
            ].map((r, k) => (
              <div
                key={r[0]}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  padding: "22px 30px",
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderLeft: `5px solid ${C.cyan}`,
                  ...reveal(f, START + 2 * LEN + 14 + k * 7, 18, 0),
                  translate: `${interpolate(p(f, START + 2 * LEN + 14 + k * 7, 18), [0, 1], [40, 0])}px 0px`,
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 800, color: C.cyan, width: 56 }}>{r[0]}</div>
                <div style={{ flex: 1, fontSize: 36, fontWeight: 600, color: C.paper }}>{r[1]}</div>
                <div style={{ fontSize: 30, color: C.muted }}>{r[2]}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* 4 Tracking */}
        <Panel i={3}>
          <div style={{ fontSize: 52, fontWeight: 800, color: C.paper }}>Fortschritt messbar</div>
          <div style={{ marginTop: 12, fontSize: 32, color: C.muted }}>
            Regelmäßig tracken, Plan laufend anpassen
          </div>
          <svg width="700" height="310" viewBox="-20 30 780 300" style={{ marginTop: "auto" }}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.cyan} stopOpacity="0.35" />
                <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
              </linearGradient>
              <clipPath id="clip">
                <rect x="-10" y="0" width={760 * draw} height="400" />
              </clipPath>
            </defs>
            {[100, 180, 260].map((y) => (
              <line key={y} x1="0" x2="740" y1={y} y2={y} stroke={C.line} strokeWidth="1.5" />
            ))}
            <g clipPath="url(#clip)">
              <path d={`${pathD} L740 330 L0 330 Z`} fill="url(#g)" />
              <path d={pathD} fill="none" stroke={C.cyan} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((q) => (
                <circle key={q[0]} cx={q[0]} cy={q[1]} r="9" fill={C.ink} stroke={C.cyan} strokeWidth="4" />
              ))}
            </g>
          </svg>
          <div style={{ fontSize: 20, color: C.faint, marginTop: 6 }}>
            Beispielhafte Darstellung · Ergebnisse sind individuell
          </div>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};
