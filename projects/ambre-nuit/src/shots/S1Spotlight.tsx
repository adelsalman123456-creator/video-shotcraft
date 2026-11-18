// S1 — light-play-moves · A spotlight-sweep (demos/effects/light-play-moves/SpotlightSweepReveal.tsx)
// Adapted for Ambre Nuit: same velvet theatre, pendulum follow-spot, tungsten flicker, iris open.
// Title re-skinned to Cormorant Garamond "Ambre Nuit"; kicker = house name, subtitle = product line.
// Timing shifted 2f earlier so the iris starts on BGM beat 7 (f119); shot ends on beat 12 (f189).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, Grain, Vignette, bezier, mix, ramp } from '../lib/Polish';
import { C, SANS, SERIF, alpha } from '../lib/brand';

export const S1_DURATION = 189;

const V = C;
const CX = 960;
const CY = 470;
const AMP = 600;
const PERIOD = 50;
const SWING0 = 6;
const SWING_END = SWING0 + PERIOD * 2.25; // 118.5 ≈ beat 7
const IRIS_END = SWING_END + 20;
const LAMP_Y = -160;
const FLOOR_Y = 868;
const R0 = 360;
const outCubic = bezier(0.215, 0.61, 0.355, 1);

const rnd = (i: number) => {
  const s = Math.sin(i * 91.7 + 13.1) * 43758.5453;
  return s - Math.floor(s);
};

const spotAt = (f: number) => {
  const sf = Math.min(Math.max(f, SWING0), SWING_END);
  const th = -Math.PI / 2 + (2 * Math.PI * (sf - SWING0)) / PERIOD;
  const env = 1 - ramp(sf, SWING0 + PERIOD * 0.75, SWING_END - SWING0 - PERIOD * 0.75, EASE.smooth);
  const u = Math.sin(th) * env;
  return { x: CX + AMP * u, y: CY + 26 - 44 * u * u };
};

const FLICKER = [0, 0.55, 0.15, 0.8, 0.45, 1];
const lampOn = (f: number) => (f < 4 ? 0 : f >= 10 ? 1 : FLICKER[Math.min(5, f - 4)]);

const Title: React.FC<{ color: string; style?: React.CSSProperties }> = ({ color, style }) => (
  <div
    style={{
      position: 'absolute', left: 0, right: 0, top: CY - 150, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}
  >
    <div style={{ fontFamily: SERIF, fontSize: 268, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color, whiteSpace: 'nowrap' }}>
      Ambre <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Nuit</span>
    </div>
  </div>
);

const CURTAIN =
  `repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0) 46px, rgba(255,210,200,0.10) 70px, rgba(0,0,0,0) 96px, rgba(0,0,0,0.55) 132px),` +
  `repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.3) 210px, rgba(0,0,0,0) 330px),` +
  `linear-gradient(180deg, ${V.velvetDeep} 0%, ${V.velvet} 55%, #43101a 100%)`;

const Curtain: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: FLOOR_Y, backgroundImage: CURTAIN, opacity }} />
);

export const S1Spotlight: React.FC = () => {
  const f = useCurrentFrame();
  const on = lampOn(f);
  const { x, y } = spotAt(f);

  const iris = ramp(f, SWING_END, IRIS_END - SWING_END, outCubic);
  const coneFade = 1 - 0.7 * ramp(f, SWING_END, IRIS_END - SWING_END, EASE.linear);
  const radius = mix(R0, 1080, iris);
  const ry = mix(R0 * 0.92, 480, iris);
  const breathe = 1 + 0.04 * Math.sin(f / 17) * ramp(f, IRIS_END, 20, EASE.smooth);

  const spotMask = `radial-gradient(ellipse ${radius.toFixed(1)}px ${ry.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.35) 72%, transparent 100%)`;
  const maskStyle: React.CSSProperties = { WebkitMaskImage: spotMask, maskImage: spotMask };

  const topHalf = 40;
  const poolHalf = mix(R0 * 1.05, 1300, iris);
  const coneBottom = y + mix(R0 * 0.8, 420, iris);
  const cone = `${CX - topHalf},${LAMP_Y} ${CX + topHalf},${LAMP_Y} ${x + poolHalf},${coneBottom} ${x - poolHalf},${coneBottom}`;

  const motes = Array.from({ length: 56 }, (_, i) => {
    const u = rnd(i);
    const v = rnd(i + 100) - 0.5;
    const drift = ((f * (0.35 + rnd(i + 200) * 0.5)) % 160) / 160;
    const uu = (u + 1 - drift * 0.4) % 1;
    const yy = mix(LAMP_Y + 120, coneBottom - 40, uu);
    const k = (yy - LAMP_Y) / (coneBottom - LAMP_Y);
    const half = mix(topHalf, poolHalf, k);
    const axisX = mix(CX, x, k);
    const xx = axisX + v * half * 1.6 + Math.sin(f / 23 + i) * 7;
    const r = 0.9 + rnd(i + 300) * 1.8;
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / (11 + rnd(i + 400) * 9) + i));
    return { xx, yy, r, a: (0.16 + rnd(i + 500) * 0.4) * tw };
  });

  const kicker = ramp(f, SWING_END + 7, 22, EASE.snappy);
  const sub = ramp(f, SWING_END + 13, 22, EASE.snappy);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${V.night0} 0%, ${V.night1} 60%, ${V.night2} 100%)`, overflow: 'hidden', fontFamily: SANS }}>
      <Curtain opacity={0.16} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 30% 22% at 50% 0%, ${alpha(V.warm, 0.1)} 0%, ${alpha(V.warm, 0)} 100%)` }} />

      <div style={{ position: 'absolute', inset: 0, opacity: on * breathe, ...maskStyle }}>
        <Curtain opacity={0.95} />
        <div style={{ position: 'absolute', inset: 0, background: alpha('#ff9a6a', 0.08), mixBlendMode: 'screen' }} />
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR_Y, bottom: 0, background: 'linear-gradient(180deg, #1c0d0c 0%, #0b0505 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: FLOOR_Y, height: 2, background: `linear-gradient(90deg, transparent, ${alpha(V.warm, 0.14)}, transparent)` }} />
      <div
        style={{
          position: 'absolute', inset: 0, opacity: on * coneFade * 0.9,
          background: `radial-gradient(ellipse ${(poolHalf * 0.9).toFixed(0)}px 70px at ${x.toFixed(1)}px ${FLOOR_Y + 60}px, ${alpha(V.warm, 0.22)} 0%, ${alpha(V.warm, 0.06)} 55%, ${alpha(V.warm, 0)} 100%)`,
        }}
      />

      <Title color={V.ink} style={{ opacity: 0.07 }} />

      <div style={{ position: 'absolute', inset: 0, opacity: on * coneFade }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="s1-beam" x1="0" y1={LAMP_Y} x2="0" y2={coneBottom} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={V.warm} stopOpacity="0.26" />
              <stop offset="0.6" stopColor={V.warm} stopOpacity="0.07" />
              <stop offset="1" stopColor={V.warm} stopOpacity="0" />
            </linearGradient>
            <filter id="s1-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <clipPath id="s1-clip">
              <polygon points={cone} />
            </clipPath>
          </defs>
          <polygon points={cone} fill="url(#s1-beam)" filter="url(#s1-soft)" />
          <g clipPath="url(#s1-clip)">
            {motes.map((m, i) => (
              <circle key={i} cx={m.xx} cy={m.yy} r={m.r} fill={V.warm} opacity={m.a} />
            ))}
          </g>
        </svg>
      </div>

      <div
        style={{
          position: 'absolute', inset: 0, opacity: on * mix(1, 0.55, iris) * breathe,
          background: `radial-gradient(ellipse ${(radius * 1.2).toFixed(0)}px ${(ry * 1.1).toFixed(0)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${alpha(V.warm, 0.16)} 0%, ${alpha(V.warm, 0.07)} 48%, ${alpha(V.warm, 0)} 100%)`,
          mixBlendMode: 'screen',
        }}
      />

      <div style={{ position: 'absolute', inset: 0, opacity: on, ...maskStyle }}>
        <Title color={V.warm} style={{ filter: 'blur(16px)', opacity: 0.5 }} />
        <Title color={V.ink} />
      </div>

      {/* kicker: house name */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: CY - 232, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22,
          opacity: kicker, fontFamily: SANS, fontSize: 30, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: `${mix(0.7, 0.42, kicker).toFixed(3)}em`, color: V.gold,
        }}
      >
        <span style={{ width: mix(0, 80, kicker), height: 1, background: alpha(V.gold, 0.6) }} />
        Maison Élan · Paris
        <span style={{ width: mix(0, 80, kicker), height: 1, background: alpha(V.gold, 0.6) }} />
      </div>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: CY + 178, textAlign: 'center',
          opacity: sub, transform: `translateY(${mix(18, 0, sub).toFixed(1)}px)`,
        }}
      >
        <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, fontWeight: 400, color: V.ink2, letterSpacing: '0.005em' }}>
          Eau de Parfum
        </div>
      </div>

      <Vignette strength={0.62} inner={0.36} color="#050102" />
      <Grain opacity={0.09} blend="soft-light" />
    </AbsoluteFill>
  );
};
