import { Easing, interpolate } from "remotion";

export const C = {
  bg: "#070c18",
  card: "#0f1729",
  cardHi: "#14203a",
  line: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  muted: "#94a3b8",
  blue: "#1aa7ec",
  blueLight: "#5cc8ff",
  yellow: "#f5b72e",
  orange: "#f2803a",
  pink: "#e04f86",
  purple: "#8b5cf6",
  teal: "#22a6b3",
};

export const FONT =
  "'Inter', 'Inter Display', system-ui, -apple-system, 'Segoe UI', sans-serif";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Clamped 0→1 progress between two frames, eased. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** Spring-like overshoot progress (for pops). */
export const pop = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
