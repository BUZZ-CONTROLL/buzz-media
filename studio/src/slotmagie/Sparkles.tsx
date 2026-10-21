import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";

/** Golden glitter trail that loops around the drum (2D overlay). */
export const SparkleTrail: React.FC<{ width: number; height: number; start?: number; layer: "back" | "front" }> = ({ width, height, start = 0, layer }) => {
  const f = useCurrentFrame() - start;
  // elliptical swirl around the centre, slightly tilted
  const cx = width / 2;
  const cy = height * 0.43;
  const rx = width * 0.47;
  const ry = height * 0.2;
  const pts: [number, number][] = [];
  const front: boolean[] = [];
  const N = 220;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2 * 1.15 - 0.6;
    const wobble = Math.sin(a * 3) * 0.06;
    const x = cx + Math.cos(a) * rx * (1 + wobble);
    const y = cy + Math.sin(a) * ry * (1 + wobble) - Math.cos(a) * height * 0.07;
    pts.push([x, y]);
    front.push(Math.sin(a) > -0.15);
  }
  const draw0 = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headIdx = Math.floor(draw0 * N);
  let d = "";
  for (let i = 0; i <= headIdx; i++) {
    const on = front[i] === (layer === "front");
    if (!on) continue;
    const prevOn = i > 0 && front[i - 1] === (layer === "front");
    d += `${prevOn ? "L" : "M"}${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} `;
  }
  const draw = interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const head = Math.floor(draw * N);
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="trail" x1="0" x2="1">
          <stop offset="0" stopColor="#fff1b8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f6c544" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff8dc" stopOpacity="1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#trail)"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#glow)"
        opacity={layer === "back" ? 0.6 : 0.95}
      />
      {/* glitter along the drawn part */}
      {new Array(90).fill(0).map((_, k) => {
        const idx = Math.floor(random(`g${k}`) * N);
        if (idx > head || front[idx] !== (layer === "front")) return null;
        const p = pts[idx];
        const jitter = (random(`j${k}`) - 0.5) * 40;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / 5 + k));
        const r = 1.5 + random(`r${k}`) * 4;
        return <circle key={k} cx={p[0] + jitter} cy={p[1] + jitter * 0.6} r={r} fill="#fff4c2" opacity={tw} filter="url(#glow)" />;
      })}
      {/* bright star at the head */}
      {draw > 0 && front[head] === (layer === "front") ? (
        <g transform={`translate(${pts[head][0]} ${pts[head][1]}) rotate(${f * 6})`} filter="url(#glow)">
          <path d="M0 -38 L6 -6 L38 0 L6 6 L0 38 L-6 6 L-38 0 L-6 -6 Z" fill="#fffbe8" opacity={0.95} />
        </g>
      ) : null}
    </svg>
  );
};
