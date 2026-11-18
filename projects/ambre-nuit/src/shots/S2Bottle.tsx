// S2 — light-play-moves · B sheen-sweep (demos/effects/light-play-moves/SheenSweepRetry.tsx)
// The hero "card" becomes the flacon: a hand-built SVG bottle (thick glass, amber juice, black/gold cap).
// Four constraints kept: single subject, clipped to the bottle silhouette, sweeps exactly once,
// conditionally mounted. Physical motive: the glass highlights drift as the bottle "turns" to the key light.
// Left column is the editorial title (line rise). Sheen starts on BGM beat 19 (local f97).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, Grain, Vignette, mix, ramp } from '../lib/Polish';
import { C, LUX, SANS, SERIF, alpha } from '../lib/brand';

export const S2_DURATION = 195;

const BX = 1080; // bottle body left (screen)
const BY = 352; // bottle body top
const BW = 420;
const BH = 448;
const FLOOR = BY + BH; // 800
const CAP_W = 196;
const CAP_H = 214;
const COLLAR_H = 34;

const SWEEP_START = 97;
const SWEEP_END = 129;

const LineRise: React.FC<{ children: React.ReactNode; start: number; style?: React.CSSProperties }> = ({ children, start, style }) => {
  const f = useCurrentFrame();
  const p = ramp(f, start, 34, EASE.out);
  return (
    <div style={{ overflow: 'hidden', paddingBottom: 18, marginBottom: -18 }}>
      <div style={{ transform: `translateY(${((1 - p) * 105).toFixed(2)}%)`, opacity: Math.min(1, p * 1.6), ...style }}>{children}</div>
    </div>
  );
};

// The flacon, drawn in local coords: body at (0, CAP_H+COLLAR_H), cap on top.
const Bottle: React.FC<{ hl: number; sweepP: number | null }> = ({ hl, sweepP }) => {
  const top = CAP_H + COLLAR_H; // body top in local coords
  const W = BW;
  const H = BH;
  const capX = (W - CAP_W) / 2;
  const colX = (W - 124) / 2;
  const total = top + H;
  // sheen band x (local) — travels from left outside to right outside
  const bandX = sweepP === null ? 0 : mix(-360, W + 200, sweepP);
  return (
    <svg width={W} height={total} viewBox={`0 0 ${W} ${total}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="s2-juice" x1="0" y1={top + 100} x2="0" y2={top + H - 40} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f6b25a" />
          <stop offset="0.35" stopColor="#e08a2c" />
          <stop offset="0.75" stopColor="#a8480f" />
          <stop offset="1" stopColor="#5e2006" />
        </linearGradient>
        <radialGradient id="s2-core" cx="0.42" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#ffb14d" stopOpacity="0.08" />
          <stop offset="1" stopColor="#ffb14d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s2-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff4e4" stopOpacity="0.16" />
          <stop offset="0.12" stopColor="#fff4e4" stopOpacity="0.04" />
          <stop offset="0.88" stopColor="#fff4e4" stopOpacity="0.03" />
          <stop offset="1" stopColor="#fff4e4" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="s2-cap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a302b" />
          <stop offset="0.18" stopColor="#1d1715" />
          <stop offset="0.7" stopColor="#0e0b0a" />
          <stop offset="1" stopColor="#231c19" />
        </linearGradient>
        <linearGradient id="s2-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c6a39" />
          <stop offset="0.22" stopColor="#f0d9a8" />
          <stop offset="0.5" stopColor="#b8955c" />
          <stop offset="0.8" stopColor="#e3c58d" />
          <stop offset="1" stopColor="#7a5a2e" />
        </linearGradient>
        <linearGradient id="s2-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="s2-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6e8" stopOpacity="0" />
          <stop offset="0.3" stopColor="#fff6e8" stopOpacity="0.12" />
          <stop offset="0.48" stopColor="#fffaf2" stopOpacity="0.55" />
          <stop offset="0.52" stopColor="#fffaf2" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#fff6e8" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff6e8" stopOpacity="0" />
        </linearGradient>
        <clipPath id="s2-silhouette">
          <rect x={0} y={top} width={W} height={H} rx={44} />
          <rect x={colX} y={CAP_H} width={124} height={COLLAR_H + 2} />
          <rect x={capX} y={0} width={CAP_W} height={CAP_H} rx={10} />
        </clipPath>
        <clipPath id="s2-inner">
          <rect x={28} y={top + 28} width={W - 56} height={H - 84} rx={24} />
        </clipPath>
      </defs>

      {/* ── glass body ── */}
      <rect x={0} y={top} width={W} height={H} rx={44} fill="#1a0d08" fillOpacity={0.55} />
      {/* juice */}
      <g clipPath="url(#s2-inner)">
        <rect x={28} y={top + 96} width={W - 56} height={H} fill="url(#s2-juice)" />
        <rect x={28} y={top + 96} width={W - 56} height={H} fill="url(#s2-core)" />
        {/* meniscus */}
        <rect x={28} y={top + 94} width={W - 56} height={4} fill="#ffd9a0" opacity={0.7} />
        <rect x={28} y={top + 98} width={W - 56} height={22} fill="#ffe2b0" opacity={0.12} />
        {/* dip tube */}
        <rect x={W / 2 - 3} y={top + 28} width={6} height={H - 110} fill="#fff3e0" opacity={0.22} />
      </g>
      {/* thick glass base: refracted juice */}
      <rect x={14} y={top + H - 54} width={W - 28} height={40} rx={18} fill="#c86a1e" opacity={0.32} />
      <rect x={14} y={top + H - 54} width={W - 28} height={2} fill="#ffd9a0" opacity={0.35} />
      {/* glass tint + walls */}
      <rect x={0} y={top} width={W} height={H} rx={44} fill="url(#s2-glass)" />
      <rect x={1} y={top + 1} width={W - 2} height={H - 2} rx={43} fill="none" stroke="#fff4e4" strokeOpacity={0.28} strokeWidth={2} />
      <rect x={27} y={top + 27} width={W - 54} height={H - 82} rx={25} fill="none" stroke="#fff4e4" strokeOpacity={0.1} strokeWidth={1.5} />
      {/* vertical glass highlights — drift as the bottle turns to the light */}
      <rect x={14 + hl * 10} y={top + 40} width={9} height={H - 90} rx={4.5} fill="url(#s2-streak)" opacity={0.6} />
      <rect x={58 + hl * 16} y={top + 120} width={26} height={H - 200} rx={13} fill="url(#s2-streak)" opacity={0.13} />
      <rect x={W - 22 + hl * 4} y={top + 50} width={4} height={H - 110} rx={2} fill="url(#s2-streak)" opacity={0.42} />

      {/* engraved label */}
      <g fontFamily={SERIF} textAnchor="middle" fill="#fff3e2">
        <text x={W / 2} y={top + 236} fontSize={40} fontWeight={500} letterSpacing="4" opacity={0.92}>
          AMBRE NUIT
        </text>
        <rect x={W / 2 - 60} y={top + 258} width={120} height={1.2} fill="#fff3e2" opacity={0.6} />
        <text x={W / 2} y={top + 292} fontFamily={SANS} fontSize={15} fontWeight={600} letterSpacing="5.5" opacity={0.75}>
          MAISON ÉLAN
        </text>
        <text x={W / 2} y={top + 318} fontFamily={SANS} fontSize={12} fontWeight={500} letterSpacing="3" opacity={0.55}>
          EAU DE PARFUM · 100 ML
        </text>
      </g>

      {/* ── collar + cap ── */}
      <rect x={colX} y={CAP_H} width={124} height={COLLAR_H + 2} fill="url(#s2-gold)" />
      <rect x={colX} y={CAP_H + COLLAR_H - 6} width={124} height={2} fill="#3a2a12" opacity={0.5} />
      <rect x={capX} y={0} width={CAP_W} height={CAP_H} rx={10} fill="url(#s2-cap)" />
      <rect x={capX} y={CAP_H - 22} width={CAP_W} height={22} fill="url(#s2-gold)" />
      <rect x={capX + 1} y={1} width={CAP_W - 2} height={CAP_H - 2} rx={9} fill="none" stroke="#fff" strokeOpacity={0.08} />
      <rect x={capX + 16 + hl * 8} y={14} width={7} height={CAP_H - 50} rx={3.5} fill="#fff" opacity={0.13} />
      <rect x={capX} y={0} width={CAP_W} height={3} rx={1.5} fill="#fff" opacity={0.12} />

      {/* ── sheen: once, clipped to the silhouette ── */}
      {sweepP !== null && (
        <g clipPath="url(#s2-silhouette)" style={{ mixBlendMode: 'screen' }}>
          <rect x={bandX} y={-200} width={300} height={total + 400} fill="url(#s2-sheen)" transform={`skewX(-24)`} style={{ transformOrigin: `${bandX + 150}px ${total / 2}px` }} />
        </g>
      )}
    </svg>
  );
};

export const S2Bottle: React.FC = () => {
  const f = useCurrentFrame();

  const enter = ramp(f, 0, 52, LUX);
  const appear = ramp(f, 0, 16, EASE.out);
  const shadowIn = ramp(f, 6, 52, LUX);
  const turn = ramp(f, SWEEP_START - 6, SWEEP_END - SWEEP_START + 12, EASE.smooth);
  const drift = ramp(f, SWEEP_END, S2_DURATION - SWEEP_END, EASE.out);
  const lift = mix(90, 0, enter) - 5 * drift;
  const sweepOn = f >= SWEEP_START && f <= SWEEP_END;
  const sweepP = sweepOn ? ramp(f, SWEEP_START, SWEEP_END - SWEEP_START, EASE.swift) : null;
  const top = CAP_H + COLLAR_H;
  // amber caustic on the floor brightens as the bottle turns into the key light
  const caustic = appear * (0.55 + 0.45 * turn);
  const kick = ramp(f, 6, 26, EASE.snappy);
  const body = ramp(f, 44, 24, EASE.out);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(180deg, #1b0c0b 0%, #120707 ${(FLOOR / 1080) * 100}%, #090404 100%)` }}>
      {/* key light upper-left + warm halo behind bottle */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 70% at 18% 0%, ${alpha(C.warm, 0.1)} 0%, ${alpha(C.warm, 0)} 70%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 520px 460px at ${BX + BW / 2}px ${BY + 80}px, ${alpha('#c76a2a', 0.22)} 0%, ${alpha('#c76a2a', 0.05)} 55%, rgba(0,0,0,0) 100%)` }} />
      {/* floor */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: 'linear-gradient(180deg, #170908 0%, #070303 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR, height: 1.5, background: `linear-gradient(90deg, transparent 20%, ${alpha(C.warm, 0.16)} 62%, transparent 95%)` }} />
      {/* caustic: light through the juice lands lower-right */}
      <div
        style={{
          position: 'absolute', left: BX + BW / 2 - 40, top: FLOOR + 10, width: 560, height: 90, borderRadius: '50%',
          background: `radial-gradient(ellipse 50% 50% at 40% 40%, ${alpha('#f0963a', 0.42)} 0%, ${alpha('#f0963a', 0.1)} 55%, rgba(0,0,0,0) 100%)`,
          filter: 'blur(14px)', opacity: caustic,
        }}
      />
      {/* contact + ambient shadow */}
      <div style={{ position: 'absolute', left: BX + 10, top: FLOOR - 14 + mix(30, 0, shadowIn), width: BW - 20, height: 34, borderRadius: '50%', background: alpha('#000000', mix(0.15, 0.7, shadowIn)), filter: 'blur(12px)', opacity: appear }} />

      {/* reflection on the polished floor */}
      <div
        style={{
          position: 'absolute', left: BX, top: FLOOR - lift, width: BW, height: 300, overflow: 'hidden', opacity: 0.16 * appear,
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, transparent 70%)', maskImage: 'linear-gradient(180deg, #000 0%, transparent 70%)',
        }}
      >
        <div style={{ transform: 'scaleY(-1)', transformOrigin: '50% 0%', position: 'absolute', left: 0, top: 0, filter: 'blur(2px)' }}>
          <div style={{ position: 'absolute', left: 0, top: -(top + BH) }}>
            <Bottle hl={turn} sweepP={null} />
          </div>
        </div>
      </div>

      {/* the bottle */}
      <div style={{ position: 'absolute', left: BX, top: BY - top, opacity: appear, transform: `translateY(${lift.toFixed(2)}px)` }}>
        <Bottle hl={turn} sweepP={sweepP} />
      </div>

      {/* left column: editorial title */}
      <div style={{ position: 'absolute', left: 168, top: 236, width: 820 }}>
        <div
          style={{
            fontFamily: SANS, fontSize: 30, fontWeight: 600, textTransform: 'uppercase', color: C.gold, opacity: ramp(f, 6, 18, EASE.out),
            letterSpacing: `${mix(0.5, 0.3, kick).toFixed(3)}em`, display: 'flex', alignItems: 'center', gap: 18,
          }}
        >
          <span style={{ width: 44, height: 1.5, background: C.gold, display: 'inline-block' }} />
          The flacon
        </div>
        <div style={{ marginTop: 26, fontFamily: SERIF, fontSize: 168, fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.02em', color: C.ink }}>
          <LineRise start={12}>Bottled</LineRise>
          <LineRise start={20}>
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: C.gold }}>twilight.</span>
          </LineRise>
        </div>
        <div
          style={{
            marginTop: 40, fontFamily: SANS, fontSize: 40, fontWeight: 400, lineHeight: 1.4, color: C.ink2,
            opacity: body, transform: `translateY(${mix(16, 0, body).toFixed(1)}px)`,
          }}
        >
          Hand-cut glass, poured with
          <br />
          the last amber light of day.
        </div>
      </div>

      <Vignette strength={0.55} inner={0.4} color="#050102" />
      <Grain opacity={0.08} blend="soft-light" />
    </AbsoluteFill>
  );
};
