// S4 — letterspace-materialize (demos/opening/letterspace-materialize/LetterspaceMaterialize.tsx)
// Wordmark "ambre nuit" crystallises: every glyph starts and finishes on the same frame (shared p,
// pathLength-normalised), continuous single-line strokes, wide tracking. Backdrop re-graded from
// violet dusk to the amber hour over a still lake. Stroke completes on BGM beat 46 (local f55);
// tagline on beat 48, house name on beat 50, then hold.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, Grain, Vignette, bezier, ramp } from '../lib/Polish';
import { C, SANS, SERIF } from '../lib/brand';

export const S4_DURATION = 167;

// Geometric lowercase single-line skeletons, 64-high box: baseline 59, x-height 22, ascender 5.
// a / r / e / i / t from the demo glyph set; m / b / n / u drawn to the same construction.
const GLYPHS: Record<string, { w: number; d: string }> = {
  a: { w: 46, d: 'M 41.5 40.5 A 18.5 18.5 0 0 0 4.5 40.5 A 18.5 18.5 0 0 0 41.5 40.5 M 41.5 22 L 41.5 59' },
  m: { w: 58, d: 'M 5 22 L 5 59 M 5 36 C 5 26, 10 22, 17 22 C 25 22, 29 27, 29 35 L 29 59 M 29 35 C 29 26, 34 22, 41 22 C 49 22, 53 27, 53 35 L 53 59' },
  b: { w: 46, d: 'M 4.5 5 L 4.5 59 M 4.5 40.5 A 18.5 18.5 0 0 1 41.5 40.5 A 18.5 18.5 0 0 1 4.5 40.5' },
  r: { w: 28, d: 'M 5 22 L 5 59 M 5 38 C 5 27, 13 22, 24 23' },
  e: { w: 46, d: 'M 4.5 40.5 L 41.5 40.5 A 18.5 18.5 0 1 0 37.2 52.4' },
  n: { w: 41, d: 'M 5 22 L 5 59 M 5 38 C 5 27, 12 22, 20.5 22 C 30 22, 36 27, 36 37 L 36 59' },
  u: { w: 41, d: 'M 5 22 L 5 43 C 5 54, 11 59, 20.5 59 C 29 59, 36 54, 36 44 M 36 22 L 36 59' },
  i: { w: 14, d: 'M 7 22 L 7 59 M 7 9.5 L 7 10' },
  t: { w: 26, d: 'M 12 8 L 12 59 M 3 22 L 23 22' },
  ' ': { w: 34, d: '' },
};

const WORD = 'ambre nuit';
const GLYPH_SCALE = 1.75;
const GLYPH_H = 64 * GLYPH_SCALE;
const TRACK = 40;
const START = 4;
const DUR = 51;

const HORIZON = 700;
const MARK_Y = 380;
const strokeEase = bezier(0.5, 0, 0.3, 1);

const ridge = (seed: number, base: number, amp: number) => {
  const pts: string[] = [];
  for (let x = -60; x <= 1980; x += 20) {
    const y = base - amp * (0.55 * Math.sin(x / 233 + seed) + 0.3 * Math.sin(x / 97 + seed * 2.1) + 0.15 * Math.sin(x / 41 + seed * 3.7) + 0.6);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M -60 ${HORIZON + 2} L ${pts.join(' L ')} L 1980 ${HORIZON + 2} Z`;
};
const FAR_RIDGE = ridge(1.3, HORIZON, 64);
const NEAR_RIDGE = ridge(4.1, HORIZON + 2, 30);

const GLINTS = Array.from({ length: 22 }, (_, i) => {
  const s = Math.sin(i * 91.7) * 43758.5453;
  const r = s - Math.floor(s);
  const s2 = Math.sin(i * 47.3 + 5) * 24634.6345;
  const r2 = s2 - Math.floor(s2);
  const depth = (i + 0.5) / 22;
  return { y: HORIZON + 8 + depth * depth * 360, x: 960 + (r - 0.5) * (500 + depth * 1100), w: 40 + r2 * 120 + depth * 160, a: 0.06 + (1 - depth) * 0.14, ph: r * 6.28 };
});

const Word: React.FC<{ e: number; glowAmt: number }> = ({ e, glowAmt }) => (
  <div style={{ display: 'flex', gap: TRACK, alignItems: 'center' }}>
    {WORD.split('').map((ch, li) => {
      const g = GLYPHS[ch];
      return (
        <svg key={li} width={g.w * GLYPH_SCALE} height={GLYPH_H} viewBox={`0 0 ${g.w} 64`} style={{ overflow: 'visible', display: 'block' }}>
          {e > 0 && g.d && (
            <path
              d={g.d} fill="none" stroke="#fff3e0" strokeWidth={5.5 / GLYPH_SCALE} strokeLinecap="round" strokeLinejoin="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - e}
              style={{ filter: `drop-shadow(0 0 ${(5 + glowAmt * 10) / GLYPH_SCALE}px rgba(255,200,140,${0.3 + glowAmt * 0.4}))` }}
            />
          )}
        </svg>
      );
    })}
  </div>
);

export const S4Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const e = ramp(frame, START, DUR, strokeEase);
  const rise = ramp(frame, START + DUR * 0.7, DUR * 0.3, EASE.swift);
  const fall = 1 - ramp(frame, START + DUR, 14, EASE.out);
  const glowAmt = e >= 1 ? fall : rise;

  const push = ramp(frame, 0, S4_DURATION, EASE.smooth);
  const sFar = 1 + 0.02 * push;
  const sNear = 1 + 0.035 * push;
  const dawn = 0.85 + 0.15 * ramp(frame, START + DUR * 0.5, DUR, EASE.out);

  const tag = ramp(frame, 83, 26, EASE.out);
  const house = ramp(frame, 111, 22, EASE.out);
  const hp = (HORIZON / 1080) * 100;

  return (
    <AbsoluteFill style={{ background: '#140b16', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${sFar})`, transformOrigin: `50% ${HORIZON}px` }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, #120b1f 0%, #23142f 24%, #452036 42%, #7a3434 54%, #b8602e ${hp - 2}%, #2a1416 ${hp}%, #0b0607 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute', left: -480, right: -480, top: HORIZON - 280, height: 560, opacity: dawn,
            background: 'radial-gradient(ellipse 50% 50% at 52% 50%, rgba(255,170,90,0.45) 0%, rgba(220,120,70,0.2) 35%, rgba(150,70,70,0.06) 65%, rgba(0,0,0,0) 80%)',
          }}
        />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="s4-far" x1="0" y1={HORIZON - 120} x2="0" y2={HORIZON} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#6b3a3c" />
              <stop offset="1" stopColor="#4a2630" />
            </linearGradient>
          </defs>
          <path d={FAR_RIDGE} fill="url(#s4-far)" opacity={0.75} style={{ filter: 'blur(1.2px)' }} />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: `scale(${sNear})`, transformOrigin: `50% ${HORIZON}px` }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d={NEAR_RIDGE} fill="#2b1619" />
        </svg>
        <div
          style={{
            position: 'absolute', left: 0, right: 0, top: HORIZON, bottom: 0,
            background:
              'radial-gradient(ellipse 46% 40% at 52% 0%, rgba(240,150,80,0.24) 0%, rgba(160,90,70,0.08) 50%, rgba(0,0,0,0) 80%), ' +
              'linear-gradient(180deg, #2d1719 0%, #1a0c0e 30%, #0c0506 100%)',
          }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, top: HORIZON - 1, height: 2, background: 'linear-gradient(90deg, rgba(255,200,150,0) 8%, rgba(255,200,150,0.38) 52%, rgba(255,200,150,0) 92%)' }} />
        {GLINTS.map((g, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', top: g.y, height: 1.5, borderRadius: 1, width: g.w, left: g.x - g.w / 2 + Math.sin(frame / 38 + g.ph) * 14,
              background: `linear-gradient(90deg, rgba(255,205,160,0), rgba(255,205,160,${(g.a * (0.75 + 0.25 * Math.sin(frame / 23 + g.ph))).toFixed(3)}), rgba(255,205,160,0))`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* wordmark reflection */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 2 * HORIZON - MARK_Y - GLYPH_H / 2, height: GLYPH_H, display: 'flex', justifyContent: 'center',
          transform: 'scaleY(-1)', opacity: 0.07, filter: 'blur(2.4px)',
          WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)', maskImage: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)',
        }}
      >
        <Word e={e} glowAmt={glowAmt * 0.5} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: MARK_Y - GLYPH_H / 2, height: GLYPH_H, display: 'flex', justifyContent: 'center' }}>
        <Word e={e} glowAmt={glowAmt} />
      </div>

      {/* tagline + house */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 488, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 400,
          color: '#f6e4cc', opacity: tag, transform: `translateY(${((1 - tag) * 20).toFixed(1)}px)`, filter: tag >= 0.999 ? undefined : `blur(${((1 - tag) * 8).toFixed(2)}px)`,
          textShadow: '0 2px 18px rgba(40,10,10,0.5)',
        }}
      >
        Wear the hour after sunset.
      </div>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
          fontFamily: SANS, fontSize: 30, fontWeight: 600, textTransform: 'uppercase', color: C.gold, opacity: house,
          letterSpacing: `${(0.62 - 0.2 * house).toFixed(3)}em`,
        }}
      >
        Maison Élan · Eau de Parfum
      </div>

      <Vignette strength={0.45} inner={0.5} color="#070304" cy={0.5} />
      <Grain opacity={0.08} blend="soft-light" />
    </AbsoluteFill>
  );
};
