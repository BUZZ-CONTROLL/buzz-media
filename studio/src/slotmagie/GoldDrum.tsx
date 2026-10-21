import React, { useEffect, useMemo, useState } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/* ------------------------------------------------------------------ */
/* Textures (drawn once on canvases)                                   */
/* ------------------------------------------------------------------ */
const SYMS = ["SUN", "🍒", "7", "🍇", "🍋", "BAR"] as const;
export const SYM_COUNT = SYMS.length;
const TEX_W = 4096;
const TEX_H = 760;
const ROT = Math.PI / 2;

const useImage = (src: string) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender("load " + src));
  useEffect(() => {
    const i = new Image();
    i.onload = async () => {
      try {
        await document.fonts.load("900 italic 200px Roboto");
      } catch (e) {
        // ignore
      }
      setImg(i);
      continueRender(handle);
    };
    i.onerror = () => continueRender(handle);
    i.src = src;
  }, [src, handle]);
  return img;
};

/** Symbol strip wrapped around one reel. Symbol k sits at angle k*60°. */
const makeSymbolTexture = (sun: HTMLImageElement, offset: number) => {
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, TEX_W, TEX_H);
  const cell = TEX_W / SYM_COUNT;
  for (let k = 0; k < SYM_COUNT; k++) {
    const s = SYMS[(k + offset) % SYM_COUNT];
    const cx = cell * k + cell / 2;
    const cy = TEX_H / 2;
    g.save();
    g.translate(cx, cy);
    g.rotate(ROT);
    g.translate(-cx, -cy);
    // soft engraved shadow
    g.shadowColor = "rgba(70,40,0,0.55)";
    g.shadowBlur = 18;
    g.shadowOffsetY = 10;
    if (s === "SUN") {
      const sz = 520;
      g.drawImage(sun, cx - sz / 2, cy - sz / 2, sz, sz);
    } else if (s === "7") {
      g.font = "900 italic 520px Roboto";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.lineWidth = 26;
      g.strokeStyle = "#7a4a00";
      g.strokeText("7", cx, cy + 20);
      g.fillStyle = "#e42521";
      g.fillText("7", cx, cy + 20);
    } else if (s === "BAR") {
      g.fillStyle = "#1a0d00";
      const w = 520;
      const h = 230;
      g.beginPath();
      g.roundRect(cx - w / 2, cy - h / 2, w, h, 36);
      g.fill();
      g.lineWidth = 16;
      g.strokeStyle = "#f6c544";
      g.stroke();
      g.shadowBlur = 0;
      g.font = "900 italic 190px Roboto";
      g.textAlign = "center";
      g.textBaseline = "middle";
      const grad = g.createLinearGradient(0, cy - 90, 0, cy + 90);
      grad.addColorStop(0, "#fff1b8");
      grad.addColorStop(0.5, "#f6c544");
      grad.addColorStop(1, "#c98a12");
      g.fillStyle = grad;
      g.fillText("BAR", cx, cy + 8);
    } else {
      g.font = "430px 'Noto Color Emoji'";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(s, cx, cy + 20);
    }
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.wrapS = THREE.RepeatWrapping;
  return t;
};

/** Motion-blurred copy of a symbol strip (smeared along the spin direction) */
const makeBlurTexture = (src: THREE.CanvasTexture) => {
  const srcCanvas = src.image as HTMLCanvasElement;
  const c = document.createElement("canvas");
  c.width = TEX_W;
  c.height = TEX_H;
  const g = c.getContext("2d")!;
  const taps = 24;
  const spread = TEX_W / SYM_COUNT * 0.9;
  g.globalAlpha = 2.2 / taps;
  for (let k = 0; k < taps; k++) {
    const dx = (k / (taps - 1) - 0.5) * spread;
    g.drawImage(srcCanvas, dx, 0);
    g.drawImage(srcCanvas, dx + TEX_W, 0);
    g.drawImage(srcCanvas, dx - TEX_W, 0);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** Brushed-gold base texture */
const makeGoldTexture = () => {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f2cf6e";
  g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 256;
    g.fillStyle = Math.random() > 0.5 ? "rgba(255,245,200,0.06)" : "rgba(140,90,0,0.04)";
    g.fillRect(0, y, 1024, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const makeCoinTexture = (sun: HTMLImageElement) => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d")!;
  const rg = g.createRadialGradient(220, 200, 40, 256, 256, 256);
  rg.addColorStop(0, "#fff1b8");
  rg.addColorStop(0.6, "#e7b94e");
  rg.addColorStop(1, "#9a650a");
  g.fillStyle = rg;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "#8a5a06";
  g.lineWidth = 18;
  g.beginPath();
  g.arc(256, 256, 220, 0, Math.PI * 2);
  g.stroke();
  g.drawImage(sun, 96, 96, 320, 320);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/* ------------------------------------------------------------------ */
/* Scene pieces                                                       */
/* ------------------------------------------------------------------ */
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
  }, [gl, scene]);
  return null;
};

const GOLD = { color: "#ffd56a", metalness: 1, roughness: 0.18 };
const GOLD_DARK = { color: "#e0a83a", metalness: 1, roughness: 0.25 };

const REEL_LEN = 1.15;
const R = 1;

const ReelSegment: React.FC<{
  x: number;
  angle: number;
  symbols: THREE.Texture;
  blurred: THREE.Texture;
  speed: number;
  gold: THREE.Texture;
}> = ({ x, angle, symbols, blurred, speed, gold }) => (
  // cylinder axis = local Y; group rotated so axis lies along world X
  <group position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
    <group rotation={[0, angle, 0]}>
      <mesh>
        <cylinderGeometry args={[R, R, REEL_LEN, 160, 1, true]} />
        <meshStandardMaterial {...GOLD} map={gold} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[R * 1.004, R * 1.004, REEL_LEN * 0.92, 160, 1, true]} />
        <meshStandardMaterial map={symbols} transparent opacity={1 - speed} depthWrite={false} metalness={0.15} roughness={0.35} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[R * 1.006, R * 1.006, REEL_LEN * 0.92, 160, 1, true]} />
        <meshStandardMaterial map={blurred} transparent opacity={speed} depthWrite={false} metalness={0.15} roughness={0.4} />
      </mesh>
    </group>
  </group>
);

const Rim: React.FC<{ x: number; r?: number; w?: number }> = ({ x, r = 1.06, w = 0.09 }) => (
  <group position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <cylinderGeometry args={[r, r, w, 160]} />
      <meshStandardMaterial {...GOLD_DARK} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[r, w * 0.45, 24, 160]} />
      <meshStandardMaterial {...GOLD} />
    </mesh>
  </group>
);

const Coin: React.FC<{ pos: [number, number, number]; rot: [number, number, number]; tex: THREE.Texture; s?: number }> = ({
  pos,
  rot,
  tex,
  s = 0.5,
}) => (
  <group position={pos} rotation={rot}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[s, s, 0.08, 96]} />
      <meshStandardMaterial attach="material-0" {...GOLD_DARK} />
      <meshStandardMaterial attach="material-1" map={tex} metalness={0.9} roughness={0.25} />
      <meshStandardMaterial attach="material-2" map={tex} metalness={0.9} roughness={0.25} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export type DrumProps = {
  width: number;
  height: number;
  /** frame at which the lever is pulled and reels start */
  start: number;
  /** stop frames for the three reels */
  stops: [number, number, number];
  /** symbol index (0=SUN) that faces the camera at rest, per reel */
  finals: [number, number, number];
  /** camera distance (smaller = bigger drum) */
  cameraZ?: number;
  /** "tilted" floating hero shot or "front" view resting on the pedestal */
  view?: "tilted" | "front";
  coins?: boolean;
};

export const GoldDrum: React.FC<DrumProps> = ({ width, height, start, stops, finals, cameraZ = 12.2, view = "tilted", coins = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = fps / 30; // keep timings in seconds regardless of fps
  const front = view === "front";
  const sun = useImage(staticFile("slotmagie/sun.png"));
  const tex = useMemo(() => {
    if (!sun) return null;
    const strip = makeSymbolTexture(sun, 0);
    return {
      reels: [strip, strip, strip],
      blur: makeBlurTexture(strip),
      gold: makeGoldTexture(),
      coin: makeCoinTexture(sun),
    };
  }, [sun]);

  // Reel angles: spin several turns, ease out, small bounce on lock
  const step = (2 * Math.PI) / SYM_COUNT;
  const angleFor = (i: number) => {
    const turns = 3 + i;
    const target = turns * 2 * Math.PI + finals[i] * step;
    const t = interpolate(f, [start, stops[i]], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (x) => 1 - Math.pow(1 - x, 3),
    });
    const s = stops[i];
    const bl = 9 * k;
    const bounce = f >= s && f < s + bl ? Math.sin(((f - s) / bl) * Math.PI) * 0.09 * (1 - (f - s) / bl) : 0;
    // texture offset: symbol k centred at u=(k+0.5)/N -> face camera
    return -(t * target) - step / 2 + bounce;
  };

  const speedFor = (i: number) => {
    const t = interpolate(f, [start, stops[i]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (f < start) return 0;
    const v = Math.pow(1 - t, 2); // derivative shape of the ease-out
    return Math.min(1, Math.max(0, (v - 0.05) * 1.6));
  };

  const lever = interpolate(f, [start - 8 * k, start, start + 10 * k], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = front ? 0 : Math.sin(f / (18 * k)) * 0.06;

  if (!tex) return null;
  const xs = [-REEL_LEN - 0.1, 0, REEL_LEN + 0.1];

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={front ? { position: [0, 1.7, cameraZ], rotation: [-Math.atan(1.7 / cameraZ) - 0.02, 0, 0], fov: 30 } : { position: [0, 0.4, cameraZ], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Env />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 6]} intensity={2.2} color="#fff4dc" />
      <directionalLight position={[-6, 2, 3]} intensity={0.8} color="#ffd9a0" />
      <pointLight position={[0, -2.5, 2]} intensity={18} distance={8} color="#ff2a1a" />
      <pointLight position={[3, -1, -3]} intensity={25} distance={9} color="#ff3020" />

      {/* floating drum */}
      <group position={front ? [0, 0, 0] : [0, 0.15 + bob, 0]} rotation={front ? [0, 0, 0] : [0.18, -0.28, 0.24]}>
        {[0, 1, 2].map((i) => (
          <ReelSegment key={i} x={xs[i]} angle={angleFor(i)} symbols={tex.reels[i]} blurred={tex.blur} speed={speedFor(i)} gold={tex.gold} />
        ))}
        <Rim x={xs[0] - REEL_LEN / 2 - 0.08} r={1.1} w={0.18} />
        <Rim x={(xs[0] + xs[1]) / 2} />
        <Rim x={(xs[1] + xs[2]) / 2} />
        <Rim x={xs[2] + REEL_LEN / 2 + 0.08} r={1.1} w={0.18} />
        {/* end caps */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * (xs[2] + REEL_LEN / 2 + 0.17), 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.85, 1.02, 0.08, 120]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        ))}
        {front
          ? [-1, 1].map((side) => (
              <group key={"foot" + side} position={[side * (xs[2] + REEL_LEN / 2 + 0.05), -1.12, 0]}>
                <mesh>
                  <boxGeometry args={[0.42, 0.22, 1.2]} />
                  <meshStandardMaterial {...GOLD_DARK} />
                </mesh>
                <mesh position={[0, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.42, 48, 1, false, Math.PI, Math.PI]} />
                  <meshStandardMaterial {...GOLD} />
                </mesh>
              </group>
            ))
          : null}
        {/* top handle like the reference */}
        <mesh position={[xs[0] * 0.55, 1.12, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.32, 0.06, 20, 64, Math.PI]} />
          <meshStandardMaterial {...GOLD} />
        </mesh>
        {/* lever on the right end */}
        <group position={[xs[2] + REEL_LEN / 2 + 0.25, 0, front ? 0 : 0.55]} rotation={front ? [-lever * 1.0, 0, -0.12] : [0, 0, -0.25 - lever * 1.1]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 24]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
          <mesh position={[0, 1.62, 0]}>
            <sphereGeometry args={[0.18, 48, 48]} />
            <meshStandardMaterial {...GOLD} />
          </mesh>
        </group>
      </group>

      {/* coins */}
      {coins ? (
        <>
      <Coin pos={[-2.35, -1.05 + Math.sin(f / 14) * 0.08, 1.2]} rot={[0.12, 0.35 + Math.sin(f / 20) * 0.3, 0.15]} tex={tex.coin} s={0.52} />
      <Coin pos={[1.95, -1.3 + Math.cos(f / 16) * 0.08, 1.6]} rot={[0.15, -0.35 - Math.sin(f / 22) * 0.3, -0.12]} tex={tex.coin} s={0.48} />
        </>
      ) : null}

      {/* pedestal with red neon ring */}
      <group position={front ? [0, -1.5, 0] : [0, -2.55, -1.2]}>
        <mesh>
          <cylinderGeometry args={[3.2, 3.3, 0.55, 128, 1, true]} />
          <meshStandardMaterial color="#141414" metalness={0.5} roughness={0.25} envMapIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.276, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.2, 128]} />
          <meshBasicMaterial color="#040404" />
        </mesh>
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.05, 0.045, 16, 200]} />
          <meshStandardMaterial color="#ff2a1a" emissive="#ff2a1a" emissiveIntensity={6} toneMapped={false} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
